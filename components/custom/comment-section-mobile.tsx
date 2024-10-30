import React, { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  SendHorizontal,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Loader2,
  Plus,
  Copy,
  Flag,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { truncateText, formatDate } from "@/lib/functions";
import { Comment } from "@/lib/definitions";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/lib/store"; // Import the useAuth hook
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

function checkUrlSafety(url: string): { isSafe: boolean; warning?: string } {
  const trustedDomains = [
    "facebook.com",
    "www.facebook.com",
    "twitter.com",
    "www.twitter.com",
    "linkedin.com",
    "www.linkedin.com",
    "instagram.com",
    "www.instagram.com",
    "github.com",
    "www.github.com",
  ];

  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;

    if (trustedDomains.includes(domain)) return { isSafe: true };

    const hasHTTPS = url.startsWith("https://");
    const hasUncommonTLD = !url.match(/\.(com|org|net|edu|gov|io|dev)$/i);
    const hasSpecialChars = /[<>{}\\]/.test(url);

    if (!hasHTTPS) {
      return {
        isSafe: false,
        warning:
          "This link uses an insecure connection (HTTP). Proceed with caution.",
      };
    }

    if (hasUncommonTLD) {
      return {
        isSafe: false,
        warning:
          "This link uses an uncommon domain extension. Verify the source before proceeding.",
      };
    }

    if (hasSpecialChars) {
      return {
        isSafe: false,
        warning: "This link contains suspicious characters. Exercise caution.",
      };
    }

    return { isSafe: true };
  } catch {
    return {
      isSafe: false,
      warning: "This link appears to be malformed. Exercise caution.",
    };
  }
}

function CommentSectionMobile({
  candidateId,
  commentsData,
  refetchComments,
  isLoading,
  error,
}: {
  candidateId: string;
  commentsData: Comment[] | [];
  refetchComments: () => void;
  isLoading: boolean;
  error: Error | null;
}) {
  const { user } = useAuthStore(); // Use the useAuth hook to get the user
  const userAvatar =
    user?.photoURL ||
    "https://api.dicebear.com/7.x/avataaars/svg?seed=DefaultUser";

  const MAX_COMMENT_LENGTH = 200;

  const [newComment, setNewComment] = useState("");
  const [expandedComments, setExpandedComments] = useState<Set<string>>(
    new Set()
  );
  const [replyingTo, setReplyingTo] = useState<{
    id: string;
    author: string;
    parentId: string | null;
    content: string; // Add this line
  } | null>(null);
  const [deletingComments, setDeletingComments] = useState<Set<string>>(
    new Set()
  );
  const [newCommentId, setNewCommentId] = useState<string | null>(null);
  const deletionTimeoutsRef = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const [comments, setComments] = useState<Comment[]>([]);
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const newCommentRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [charCount, setCharCount] = useState(0);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [isUrlDialogOpen, setIsUrlDialogOpen] = useState(false);
  const [hasSpecialCharacters, setHasSpecialCharacters] = useState(false);

  useEffect(() => {
    setComments(commentsData || []);
  }, [commentsData]);

  useEffect(() => {
    setCharCount(newComment.length);
  }, [newComment]);

  const toggleReplies = (commentId: string) => {
    setExpandedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const handleLikeDislike = async (
    commentId: string,
    action: "like" | "dislike"
  ) => {
    // Implement like/dislike logic here
  };

  const handleReply = (
    id: string,
    author: string,
    isAuthor: boolean,
    parentId: string | null = null,
    content: string // Add this parameter
  ) => {
    setReplyingTo({
      id,
      author: isAuthor ? "my comment" : author,
      parentId: parentId || id,
      content, // Add this line
    });
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const createCommentMutation = useMutation({
    mutationFn: async ({
      content,
      parentCommentId,
    }: {
      content: string;
      parentCommentId?: string;
    }) => {
      const response = await axios.post("/api/candidate/comments", {
        candidateId,
        content,
        parentCommentId,
      });
      return response.data.comment;
    },
    onSuccess: (newCommentData, variables) => {
      setComments((prevComments) => {
        if (variables.parentCommentId) {
          return prevComments.map((comment) => {
            if (comment.id === variables.parentCommentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), newCommentData],
              };
            }
            return comment;
          });
        } else {
          return [newCommentData, ...prevComments];
        }
      });
      setNewCommentId(newCommentData.id);
      setTimeout(() => {
        setNewCommentId(null);
        if (newCommentRef.current) {
          newCommentRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
      setNewComment("");
      setReplyingTo(null);
      queryClient.invalidateQueries(["comments", candidateId]);
      refetchComments();
    },
    onError: (error) => {
      console.error("Error posting comment:", error);
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async ({
      commentId,
      parentCommentId,
    }: {
      commentId: string;
      parentCommentId?: string;
    }) => {
      const url = parentCommentId
        ? `/api/candidate/comments?commentId=${commentId}&parentCommentId=${parentCommentId}`
        : `/api/candidate/comments?commentId=${commentId}`;
      await axios.delete(url);
    },
    onMutate: ({ commentId, parentCommentId }) => {
      removeCommentLocally(commentId, parentCommentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", candidateId]);
      refetchComments();
      // Remove success toast
    },
    onError: (error) => {
      console.error("Error deleting comment:", error);
      refetchComments();
      toast({
        title: "Error",
        description: "Failed to delete comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    let content = newComment;
    if (replyingTo) {
      content =
        replyingTo.author === "my comment"
          ? content
          : `@${replyingTo.author} ${content}`;
    }

    createCommentMutation.mutate({
      content,
      parentCommentId: replyingTo?.parentId || replyingTo?.id,
    });
  };

  const removeCommentLocally = useCallback(
    (commentId: string, parentCommentId?: string) => {
      setComments((prevComments) => {
        if (parentCommentId) {
          return prevComments.map((comment) => {
            if (comment.id === parentCommentId) {
              return {
                ...comment,
                replies: (comment.replies || []).filter(
                  (reply) => reply.id !== commentId
                ),
              };
            }
            return comment;
          });
        } else {
          return prevComments.filter((comment) => comment.id !== commentId);
        }
      });
    },
    []
  );

  const handleDeleteComment = (commentId: string, parentCommentId?: string) => {
    deleteCommentMutation.mutate({ commentId, parentCommentId });
  };

  const handleReportComment = (commentId: string) => {
    // Implement the report logic here
    console.log(`Reporting comment: ${commentId}`);
    // You might want to open a modal or make an API call to report the comment
  };

  const handleAddCommentClick = () => {
    inputRef.current?.focus();
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (input.length <= MAX_COMMENT_LENGTH) {
      setNewComment(input);
    }
  };

  const handleCopyComment = (content: string) => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        toast({
          title: "Copied",
          description: "Comment copied to clipboard",
          duration: 2000,
        });
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        toast({
          title: "Error",
          description: "Failed to copy comment",
          variant: "destructive",
        });
      });
  };

  const handleUrlClick = (url: string) => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast({
          title: "URL Copied",
          description: "Link has been copied to clipboard",
          duration: 2000,
        });
      })
      .catch((err) => {
        console.error("Failed to copy URL: ", err);
        toast({
          title: "Error",
          description: "Failed to copy URL",
          variant: "destructive",
        });
      });
  };

  const renderComment = (
    comment: Comment,
    isReply = false,
    parentCommentId?: string
  ) => (
    <motion.div
      key={comment.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`pb-4 ${isReply ? "ml-7 pl-4" : ""} relative`}>
      {isReply && (
        <>
          <div className='absolute left-0 top-0 bottom-0 w-px bg-gray-300 dark:bg-gray-600' />
          <div className='absolute left-0 top-4 w-4 h-px bg-gray-300 dark:bg-gray-600' />
        </>
      )}
      <div className='flex items-start space-x-3'>
        <Image
          src={comment.avatar}
          alt={comment.author}
          width={28}
          height={28}
          className='rounded-full flex-shrink-0'
        />
        <div className='flex-1 min-w-0'>
          <div className='flex justify-between items-center'>
            <span
              className={`text-sm font-semibold text-slate-700 dark:text-slate-200`}>
              {comment.isAuthor ? "Me" : comment.author}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size='sm' variant='ghost' className='h-8 w-8 p-0'>
                  <MoreVertical className='w-4 h-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem
                  onClick={() => handleCopyComment(comment.content)}
                  className='text-gray-700 dark:text-gray-300'>
                  <Copy className='w-4 h-4 mr-2' />
                  Copy
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleReportComment(comment.id)}
                  className='text-yellow-600'>
                  <Flag className='w-4 h-4 mr-2' />
                  Report
                </DropdownMenuItem>
                {comment.isAuthor && (
                  <DropdownMenuItem
                    onClick={() =>
                      handleDeleteComment(
                        comment.id,
                        isReply ? parentCommentId : undefined
                      )
                    }
                    className='text-red-600'>
                    <Trash2 className='w-4 h-4 mr-2' />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className='text-sm mt-1 break-words whitespace-pre-wrap'>
            {(() => {
              const words = comment.content.split(" ");
              const result = [];
              let i = 0;

              while (i < words.length) {
                let word = words[i];

                // Check for mentions
                if (word.startsWith("@")) {
                  // If this is a reply, check against parent author
                  if (isReply && comment.author) {
                    const parentAuthorMention = `@${comment.author}`;
                    if (comment.content.includes(parentAuthorMention)) {
                      word = parentAuthorMention;
                      i += parentAuthorMention.split(" ").length - 1;
                    }
                  }

                  result.push(
                    <span
                      key={i}
                      className='text-slate-700 dark:text-slate-200 font-semibold'>
                      {word}{" "}
                    </span>
                  );
                }
                // Check for URLs
                else if (word.match(/^(https?:\/\/[^\s]+)/)) {
                  const displayUrl = truncateText(word, 30);
                  result.push(
                    <span
                      key={i}
                      className='text-blue-500 dark:text-blue-400 hover:text-blue-600 
                        dark:hover:text-blue-300 cursor-pointer transition-colors duration-200'
                      onClick={() => {
                        setSelectedUrl(word);
                        setIsUrlDialogOpen(true);
                      }}>
                      {displayUrl}{" "}
                    </span>
                  );
                }
                // Regular word
                else {
                  result.push(<React.Fragment key={i}>{word} </React.Fragment>);
                }

                i++;
              }

              return result;
            })()}
          </p>
          <div className='flex items-center mt-2 text-xs text-gray-500 space-x-4'>
            <span>{formatDate(comment.createdAt)}</span>
            <button
              onClick={() =>
                handleReply(
                  comment.id,
                  comment.author,
                  comment.isAuthor,
                  parentCommentId,
                  comment.content // Add this line
                )
              }
              className='flex items-center'>
              <MessageCircle className='w-4 h-4 mr-1' />
              Reply
            </button>
            <div className='flex items-center space-x-3'>
              <button
                onClick={() => handleLikeDislike(comment.id, "like")}
                className={cn("flex items-center", {
                  "text-blue-500": comment.userInteractions["like"],
                })}>
                <ThumbsUp className='w-4 h-4 mr-1' />
                {
                  Object.values(comment.userInteractions).filter(
                    (v) => v === "like"
                  ).length
                }
              </button>
              <button
                onClick={() => handleLikeDislike(comment.id, "dislike")}
                className={cn("flex items-center", {
                  "text-red-500": comment.userInteractions["dislike"],
                })}>
                <ThumbsDown className='w-4 h-4 mr-1' />
                {
                  Object.values(comment.userInteractions).filter(
                    (v) => v === "dislike"
                  ).length
                }
              </button>
            </div>
          </div>
        </div>
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div className='mt-2'>
          <button
            onClick={() => toggleReplies(comment.id)}
            className='text-xs text-gray-500 flex items-center hover:text-blue-500 transition-colors duration-200'>
            {expandedComments.has(comment.id) ? (
              <>
                <ChevronUp className='w-3 h-3 mr-1' />
                <span className='font-medium'>Hide</span>
              </>
            ) : (
              <>
                <ChevronDown className='w-3 h-3 mr-1' />
                <span className='font-medium'>
                  {comment.replies.length}{" "}
                  {comment.replies.length === 1 ? "reply" : "replies"}
                </span>
              </>
            )}
          </button>
          <AnimatePresence>
            {expandedComments.has(comment.id) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className='mt-2 overflow-hidden'>
                {comment.replies.map((reply) =>
                  renderComment(reply, true, comment.id)
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );

  if (isLoading)
    return <div className='p-4 text-center'>Loading comments...</div>;
  if (error)
    return (
      <div className='p-4 text-center text-red-500'>
        Error loading comments: {error.message}
      </div>
    );

  return (
    <div className='flex flex-col h-full md:h-[80vh] bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 md:overflow-hidden'>
      {/* Mobile header */}
      <div className='px-4 py-2 border-b flex justify-between items-center bg-white dark:bg-gray-800 dark:border-gray-700 md:hidden'>
        <h2 className='text-base font-semibold dark:text-white'>Comments</h2>
        <span className='text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full'>
          {comments.length}
        </span>
      </div>

      {/* Updated Desktop header with minimal button */}
      <div className='hidden md:flex justify-between items-center px-6 py-4 border-b dark:border-gray-700'>
        <div className='flex items-center space-x-2'>
          <MessageCircle className='w-5 h-5 text-gray-500 dark:text-gray-400' />
          <h2 className='text-lg font-semibold dark:text-white'>Comments</h2>
          <span className='text-sm font-medium text-gray-500 dark:text-gray-400'>
            (
            {comments.reduce(
              (acc, comment) => acc + 1 + (comment.replies?.length || 0),
              0
            )}
            )
          </span>
        </div>
        <Button
          onClick={handleAddCommentClick}
          size='sm'
          variant='ghost'
          className='text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300'>
          <Plus className='w-4 h-4 mr-1' />
          Add Comment
        </Button>
      </div>

      <ScrollArea
        ref={scrollAreaRef}
        className='flex-1 px-4 md:py-4 md:px-6 md:overflow-y-auto'>
        <AnimatePresence>
          {comments.map((comment, index) => (
            <motion.div
              key={comment.id}
              ref={newCommentId === comment.id ? newCommentRef : null}
              initial={
                newCommentId === comment.id ? { opacity: 0, y: 20 } : false
              }
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={cn(index === 0 ? "mt-4" : "", "md:mb-6")}>
              {renderComment(comment)}
            </motion.div>
          ))}
        </AnimatePresence>
      </ScrollArea>

      <div className='py-3 px-4 border-t bg-white dark:bg-gray-800 dark:border-gray-700 md:px-6'>
        <div className='flex flex-col space-y-2'>
          {replyingTo && (
            <div className='flex items-center justify-between bg-blue-50 dark:bg-blue-900 p-2 rounded-md'>
              <div className='flex flex-col'>
                <span className='text-sm text-blue-600 dark:text-blue-300'>
                  Replying to{" "}
                  {replyingTo.author === "my comment"
                    ? "my comment"
                    : `@${replyingTo.author}`}
                </span>
                <span className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                  {truncateText(replyingTo.content, 50)}
                </span>
              </div>
              <Button
                size='sm'
                variant='ghost'
                onClick={() => setReplyingTo(null)}
                className='text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100'>
                Cancel
              </Button>
            </div>
          )}
          <div className='flex items-center space-x-3'>
            <Image
              src={userAvatar}
              alt='Your avatar'
              width={36}
              height={36}
              className='rounded-full bg-gray-200 dark:bg-gray-700'
            />
            <div className='flex-1 flex items-center bg-white dark:bg-gray-700 rounded-full border border-gray-300 dark:border-gray-600 px-3 py-1 focus-within:ring-2 focus-within:ring-blue-500/50 dark:focus-within:ring-blue-400/50 focus-within:border-transparent transition-all duration-200'>
              <Input
                ref={inputRef}
                placeholder={
                  replyingTo
                    ? `Reply to ${replyingTo.author}...`
                    : "Add a comment..."
                }
                value={newComment}
                onChange={handleCommentChange}
                className='flex-1 border-none focus:ring-0 focus:outline-none dark:focus:bg-gray-600 transition-colors duration-200 bg-transparent shadow-none text-sm dark:text-white focus-visible:ring-0 focus-visible:ring-offset-0'
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitComment();
                  }
                }}
              />
              <div className='flex items-center space-x-2'>
                <span
                  className={`text-xs ${
                    charCount >= MAX_COMMENT_LENGTH
                      ? "text-red-500"
                      : "text-gray-400"
                  }`}>
                  {charCount}/{MAX_COMMENT_LENGTH}
                </span>
                <Button
                  onClick={handleSubmitComment}
                  size='sm'
                  variant='ghost'
                  className='rounded-full w-8 h-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200'
                  disabled={
                    createCommentMutation.isLoading ||
                    !newComment.trim() ||
                    charCount > MAX_COMMENT_LENGTH
                  }>
                  {createCommentMutation.isLoading ? (
                    <Loader2 className='w-5 h-5 text-blue-500 dark:text-blue-400 animate-spin' />
                  ) : (
                    <SendHorizontal className='w-5 h-5 text-blue-500 dark:text-blue-400' />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isUrlDialogOpen} onOpenChange={setIsUrlDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>External Link</DialogTitle>
            <DialogDescription>
              You&apos;re about to visit this external link:
            </DialogDescription>
          </DialogHeader>
          <div className='my-4 space-y-3'>
            <p className='text-sm font-medium break-all bg-muted p-3 rounded-md'>
              {selectedUrl}
            </p>
            {selectedUrl && !checkUrlSafety(selectedUrl).isSafe && (
              <div className='flex items-start space-x-2 text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md'>
                <AlertTriangle className='w-5 h-5 flex-shrink-0 mt-0.5' />
                <div className='space-y-1'>
                  <p className='font-medium'>Security Warning</p>
                  <p className='text-sm opacity-90'>
                    {checkUrlSafety(selectedUrl).warning}
                  </p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className='flex gap-2'>
            <Button variant='outline' onClick={() => setIsUrlDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={
                checkUrlSafety(selectedUrl!).isSafe ? "default" : "destructive"
              }
              onClick={() => {
                window.open(selectedUrl!, "_blank", "noopener,noreferrer");
                setIsUrlDialogOpen(false);
              }}>
              {checkUrlSafety(selectedUrl!).isSafe
                ? "Open Link"
                : "Proceed Anyway"}
            </Button>
            <Button
              variant='secondary'
              onClick={() => {
                navigator.clipboard.writeText(selectedUrl!);
                toast({
                  title: "Copied",
                  description: "Link copied to clipboard",
                  duration: 2000,
                });
              }}>
              Copy Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={hasSpecialCharacters}
        onOpenChange={setHasSpecialCharacters}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Warning: Special Characters Detected</DialogTitle>
            <DialogDescription>
              Your comment contains special characters or formatting that might
              be hard to read. Would you like to:
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 mt-4'>
            <Button
              variant='outline'
              onClick={() => {
                const cleanText = newComment
                  .normalize("NFKD")
                  .replace(/[\u0300-\u036f]/g, "");
                setNewComment(cleanText);
                setHasSpecialCharacters(false);
              }}
              className='w-full'>
              Clean up special characters
            </Button>
            <Button
              variant='default'
              onClick={() => {
                setHasSpecialCharacters(false);
                // Proceed with original comment
                createCommentMutation.mutate({
                  content: newComment,
                  parentCommentId: replyingTo?.parentId || replyingTo?.id,
                });
              }}
              className='w-full'>
              Post anyway
            </Button>
            <Button
              variant='ghost'
              onClick={() => setHasSpecialCharacters(false)}
              className='w-full'>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CommentSectionMobile;
