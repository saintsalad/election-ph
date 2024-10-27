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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { truncateText } from "@/lib/functions";
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
import { formatDate } from "@/lib/functions";
import { toast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/lib/store"; // Import the useAuth hook

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
    if (newComment.trim()) {
      let content = newComment;
      if (replyingTo) {
        content =
          replyingTo.author === "my comment"
            ? newComment
            : `@${replyingTo.author} ${newComment}`;
      }
      createCommentMutation.mutate({
        content,
        parentCommentId: replyingTo?.parentId || replyingTo?.id,
      });
    }
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
              className={`text-sm font-semibold ${
                comment.isAuthor ? "text-blue-600" : ""
              }`}>
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
            {comment.content.split(" ").map((word, index) =>
              word.startsWith("@") ? (
                <span key={index} className='text-blue-500 font-semibold'>
                  {word}{" "}
                </span>
              ) : (
                <React.Fragment key={index}>{word} </React.Fragment>
              )
            )}
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
    </div>
  );
}

export default CommentSectionMobile;
