import React, { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Send,
  ChevronDown,
  ChevronUp,
  MoreVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Comment } from "@/lib/definitions";
import useReactQueryNext from "@/hooks/useReactQueryNext";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import { formatDate } from "@/lib/functions";

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
  const [newComment, setNewComment] = useState("");
  const [expandedComments, setExpandedComments] = useState<Set<string>>(
    new Set()
  );
  const [replyingTo, setReplyingTo] = useState<{
    id: string;
    author: string;
  } | null>(null);
  const [deletingComments, setDeletingComments] = useState<Set<string>>(
    new Set()
  );
  const [newCommentId, setNewCommentId] = useState<string | null>(null);
  const deletionTimeoutsRef = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    setComments(commentsData || []);
  }, [commentsData]);

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

  const handleReply = (id: string, author: string) => {
    setReplyingTo({ id, author });
  };

  const handleSubmitComment = async () => {
    if (newComment.trim()) {
      try {
        const parentCommentId = replyingTo?.id;

        const response = await axios.post("/api/candidate/comments", {
          candidateId,
          content: replyingTo
            ? `@${replyingTo.author} ${newComment}`
            : newComment,
          parentCommentId,
        });

        const newCommentData = response.data.comment;

        setComments((prevComments) => {
          if (parentCommentId) {
            // If it's a reply, find the parent comment and add the reply
            return prevComments.map((comment) => {
              if (comment.id === parentCommentId) {
                return {
                  ...comment,
                  replies: [...(comment.replies || []), newCommentData],
                };
              }
              return comment;
            });
          } else {
            // If it's a new top-level comment, add it to the beginning of the list
            return [newCommentData, ...prevComments];
          }
        });

        setNewCommentId(newCommentData.id);
        setTimeout(() => setNewCommentId(null), 500); // Reset after animation

        setNewComment("");
        setReplyingTo(null);

        // Refetch comments in the background
        refetchComments();
      } catch (error) {
        console.error("Error posting comment:", error);
      }
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

  const handleDeleteComment = async (
    commentId: string,
    parentCommentId?: string
  ) => {
    setDeletingComments((prev) => new Set(prev).add(commentId));

    // Immediately remove the comment from local state
    removeCommentLocally(commentId, parentCommentId);

    // Clear any existing timeout for this comment
    if (deletionTimeoutsRef.current[commentId]) {
      clearTimeout(deletionTimeoutsRef.current[commentId]);
    }

    // Set a new timeout for the API call
    deletionTimeoutsRef.current[commentId] = setTimeout(async () => {
      try {
        const url = parentCommentId
          ? `/api/candidate/comments?commentId=${commentId}&parentCommentId=${parentCommentId}`
          : `/api/candidate/comments?commentId=${commentId}`;
        await axios.delete(url);

        // Call refetchComments after successful deletion
        refetchComments();
      } catch (error) {
        console.error("Error deleting comment:", error);
        // If the API call fails, we should add the comment back
        refetchComments();
      } finally {
        setDeletingComments((prev) => {
          const newSet = new Set(prev);
          newSet.delete(commentId);
          return newSet;
        });
        delete deletionTimeoutsRef.current[commentId];
      }
    }, 500); // Delay API call until after the animation
  };

  const handleReportComment = (commentId: string) => {
    // Implement the report logic here
    console.log(`Reporting comment: ${commentId}`);
    // You might want to open a modal or make an API call to report the comment
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
      className={`mb-4 ${isReply ? "ml-8" : ""} relative overflow-hidden`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}>
        {isReply && (
          <div className='absolute left-0 top-0 bottom-0 w-px bg-gray-300 -ml-4' />
        )}
        <div className='flex items-start space-x-2'>
          <div className='w-8 h-8 relative flex-shrink-0'>
            <Image
              src={comment.avatar}
              alt={comment.author}
              width={32}
              height={32}
              className='rounded-full'
              unoptimized
            />
          </div>
          <div className='flex-1 min-w-0'>
            {" "}
            {/* Added min-w-0 here */}
            <div className='flex justify-between items-start'>
              <span className='font-semibold text-sm'>{comment.author}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size='sm'
                    variant='ghost'
                    className='text-gray-500 p-1 h-auto'>
                    <MoreVertical className='w-4 h-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem
                    onClick={() => handleReportComment(comment.id)}
                    className='text-yellow-600'>
                    Report
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      handleDeleteComment(
                        comment.id,
                        isReply ? parentCommentId : undefined
                      )
                    }
                    className='text-red-600'>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className='text-sm mt-1 break-words whitespace-pre-wrap overflow-hidden'>
              {comment.content.split(" ").map((word, index) =>
                word.startsWith("@") ? (
                  <span key={index} className='text-blue-500 font-semibold'>
                    {word}{" "}
                  </span>
                ) : (
                  <React.Fragment key={index}>{word} </React.Fragment>
                )
              )}
            </div>
            <div className='flex items-center mt-2 gap-x-5'>
              <div className='flex items-center space-x-4 w-3/6'>
                <span className='text-xs text-gray-500'>
                  {formatDate(comment.createdAt)}
                </span>
                <button
                  onClick={() => handleReply(comment.id, comment.author)}
                  className='flex items-center space-x-1 text-xs text-gray-500'>
                  <MessageCircle className='w-4 h-4 cursor-pointer' />
                  <span>Reply</span>
                </button>
              </div>
              <div className='flex items-center space-x-2'>
                <button
                  onClick={() => handleLikeDislike(comment.id, "like")}
                  className={cn(
                    "flex items-center space-x-1 text-xs transition-colors duration-200 w-16 group",
                    {
                      "text-blue-500": comment.userInteractions["like"],
                    }
                  )}>
                  <ThumbsUp className='w-4 h-4 cursor-pointer flex-shrink-0 transition-transform duration-200 ease-in-out' />
                  <span className='truncate'>
                    {
                      Object.values(comment.userInteractions).filter(
                        (v) => v === "like"
                      ).length
                    }
                  </span>
                </button>
                <button
                  onClick={() => handleLikeDislike(comment.id, "dislike")}
                  className={cn(
                    "flex items-center space-x-1 text-xs transition-colors duration-200 w-16 group",
                    {
                      "text-red-500": comment.userInteractions["dislike"],
                    }
                  )}>
                  <ThumbsDown className='w-4 h-4 cursor-pointer flex-shrink-0 transition-transform duration-200 ease-in-out' />
                  <span className='truncate'>
                    {
                      Object.values(comment.userInteractions).filter(
                        (v) => v === "dislike"
                      ).length
                    }
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        {comment.replies && comment.replies.length > 0 && (
          <div className='mt-2'>
            <button
              onClick={() => toggleReplies(comment.id)}
              className='text-sm text-blue-500 flex items-center'>
              {expandedComments.has(comment.id) ? (
                <>
                  <ChevronUp className='w-4 h-4 mr-1' />
                  Hide Replies
                </>
              ) : (
                <>
                  <ChevronDown className='w-4 h-4 mr-1' />
                  Show Replies ({comment.replies.length})
                </>
              )}
            </button>
            {expandedComments.has(comment.id) && (
              <div className='mt-2'>
                {comment.replies.map((reply) =>
                  renderComment(reply, true, comment.id)
                )}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );

  if (isLoading) return <div>Loading comments...</div>;
  if (error) return <div>Error loading comments: {error.message}</div>;

  return (
    <div className='flex flex-col h-full'>
      <div className='px-4 py-1.5 border-b flex justify-between items-center bg-white'>
        <h2 className='text-base font-semibold'>Comments</h2>
        <span className='text-sm font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full'>
          {comments.length}
        </span>
      </div>
      <ScrollArea className='flex-1 px-4'>
        <AnimatePresence>
          {comments.map((comment, index) => (
            <motion.div
              key={comment.id}
              initial={
                newCommentId === comment.id ? { opacity: 0, y: 20 } : false
              }
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={index === 0 ? "mt-4" : ""}>
              {renderComment(comment)}
            </motion.div>
          ))}
        </AnimatePresence>
      </ScrollArea>
      <div className='py-3 px-2 border-t bg-gray-50'>
        <div className='flex items-center space-x-2'>
          <div className='w-10 h-10 relative'>
            <Image
              src='https://api.dicebear.com/7.x/avataaars/svg?seed=CurrentUser'
              alt='Your avatar'
              layout='fill'
              className='rounded-full bg-gray-200'
              unoptimized
            />
          </div>
          <div className='flex-1 flex items-center bg-white rounded-full border border-gray-300 px-2 py-0'>
            <Input
              placeholder={
                replyingTo
                  ? `Reply to ${replyingTo.author}...`
                  : "Add a comment..."
              }
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className='flex-1 border-none focus:ring-0 bg-transparent shadow-none'
            />
            <Button
              onClick={handleSubmitComment}
              size='icon'
              variant='ghost'
              className='rounded-full'>
              <Send className='w-5 h-5 text-blue-500' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommentSectionMobile;
