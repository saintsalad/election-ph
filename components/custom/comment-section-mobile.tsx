import React, { useState } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCount } from "@/lib/utils";

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  likes: number;
  dislikes: number;
  replies?: Comment[];
  createdAt: string;
}

const sampleComments: Comment[] = [
  {
    id: "1",
    author: "Juan Dela Cruz",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juan",
    content:
      "Grabe ang galing ni @CandidateName! Lalo na yung plano niya para sa ekonomiya.",
    likes: 1500,
    dislikes: 2,
    createdAt: "2h ago",
    replies: [
      {
        id: "2",
        author: "Maria Santos",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
        content:
          "@Juan Dela Cruz Oo nga! Excited ako sa infrastructure plans niya.",
        likes: 5000,
        dislikes: 0,
        createdAt: "1h ago",
      },
    ],
  },
  {
    id: "3",
    author: "Pedro Penduko",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro",
    content:
      "May mga tanong ako tungkol sa environmental policies. @CandidateName, pwede mo bang ipaliwanag ang plano mo para sa renewable energy?",
    likes: 80,
    dislikes: 1,
    createdAt: "3h ago",
  },
  {
    id: "4",
    author: "Nena Dizon",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nena",
    content:
      "Maganda ang proposal para sa education reform. Sana may mas detalyadong plano para sa training ng mga guro.",
    likes: 12,
    dislikes: 0,
    createdAt: "4h ago",
    replies: [
      {
        id: "5",
        author: "Tomas Batumbakal",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tomas",
        content:
          "@Nena Dizon Tama! Napaka-importante ng teacher training para sa tagumpay ng anumang education reform.",
        likes: 3,
        dislikes: 0,
        createdAt: "3h ago",
      },
    ],
  },
];

function CommentSectionMobile() {
  const [comments, setComments] = useState<Comment[]>(sampleComments);
  const [newComment, setNewComment] = useState("");
  const [expandedComments, setExpandedComments] = useState<Set<string>>(
    new Set()
  );
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [dislikedComments, setDislikedComments] = useState<Set<string>>(
    new Set()
  );
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

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

  const toggleLike = (commentId: string) => {
    setComments((prevComments) =>
      updateCommentTree(prevComments, commentId, (comment) => {
        if (likedComments.has(commentId)) {
          setLikedComments((prev) => {
            const newSet = new Set(prev);
            newSet.delete(commentId);
            return newSet;
          });
          return { ...comment, likes: comment.likes - 1 };
        } else {
          setLikedComments((prev) => new Set(prev).add(commentId));
          if (dislikedComments.has(commentId)) {
            setDislikedComments((prev) => {
              const newSet = new Set(prev);
              newSet.delete(commentId);
              return newSet;
            });
            return {
              ...comment,
              likes: comment.likes + 1,
              dislikes: comment.dislikes - 1,
            };
          }
          return { ...comment, likes: comment.likes + 1 };
        }
      })
    );
  };

  const toggleDislike = (commentId: string) => {
    setComments((prevComments) =>
      updateCommentTree(prevComments, commentId, (comment) => {
        if (dislikedComments.has(commentId)) {
          setDislikedComments((prev) => {
            const newSet = new Set(prev);
            newSet.delete(commentId);
            return newSet;
          });
          return { ...comment, dislikes: comment.dislikes - 1 };
        } else {
          setDislikedComments((prev) => new Set(prev).add(commentId));
          if (likedComments.has(commentId)) {
            setLikedComments((prev) => {
              const newSet = new Set(prev);
              newSet.delete(commentId);
              return newSet;
            });
            return {
              ...comment,
              dislikes: comment.dislikes + 1,
              likes: comment.likes - 1,
            };
          }
          return { ...comment, dislikes: comment.dislikes + 1 };
        }
      })
    );
  };

  const handleReply = (author: string) => {
    setReplyingTo(author);
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`mb-4 ${isReply ? "ml-8 relative" : ""}`}>
      {isReply && (
        <div className='absolute left-0 top-0 bottom-0 w-px bg-gray-300 -ml-4' />
      )}
      <div className='flex items-start space-x-2'>
        <div className='w-8 h-8 relative'>
          <Image
            src={comment.avatar}
            alt={comment.author}
            width={32}
            height={32}
            className='rounded-full'
            unoptimized
          />
        </div>
        <div className='flex-1'>
          <span className='font-semibold text-sm'>{comment.author}</span>
          <p className='text-sm mt-1'>
            {comment.content.split(" ").map((word, index) =>
              word.startsWith("@") ? (
                <span key={index} className='text-blue-500 font-semibold'>
                  {word}{" "}
                </span>
              ) : (
                word + " "
              )
            )}
          </p>
          <div className='flex items-center mt-2 gap-x-5'>
            <div className='flex items-center space-x-4 w-3/6'>
              <span className='text-xs text-gray-500'>{comment.createdAt}</span>
              <button
                onClick={() => handleReply(comment.author)}
                className='flex items-center space-x-1 text-xs text-gray-500'>
                <MessageCircle className='w-4 h-4 cursor-pointer' />
                <span>Reply</span>
              </button>
            </div>
            <div className='flex items-center space-x-2'>
              <button
                onClick={() => toggleLike(comment.id)}
                className={cn(
                  "flex items-center space-x-1 text-xs transition-colors duration-200 w-16 group",
                  {
                    "text-blue-500": likedComments.has(comment.id),
                  }
                )}>
                <ThumbsUp
                  className={cn(
                    "w-4 h-4 cursor-pointer flex-shrink-0 transition-transform duration-200 ease-in-out",
                    {
                      "group-hover:scale-125": !likedComments.has(comment.id),
                      "animate-like": likedComments.has(comment.id),
                    }
                  )}
                />
                <span className='truncate'>{formatCount(comment.likes)}</span>
              </button>
              <button
                onClick={() => toggleDislike(comment.id)}
                className={cn(
                  "flex items-center space-x-1 text-xs transition-colors duration-200 w-16 group",
                  {
                    "text-red-500": dislikedComments.has(comment.id),
                  }
                )}>
                <ThumbsDown
                  className={cn(
                    "w-4 h-4 cursor-pointer flex-shrink-0 transition-transform duration-200 ease-in-out",
                    {
                      "group-hover:scale-125": !dislikedComments.has(
                        comment.id
                      ),
                      "animate-dislike": dislikedComments.has(comment.id),
                    }
                  )}
                />
                <span className='truncate'>
                  {formatCount(comment.dislikes)}
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
              {comment.replies.map((reply) => renderComment(reply, true))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      const newCommentObj: Comment = {
        id: Date.now().toString(),
        author: "Current User",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CurrentUser",
        content: replyingTo ? `@${replyingTo} ${newComment}` : newComment,
        likes: 0,
        dislikes: 0,
        createdAt: "Just now",
      };
      setComments([newCommentObj, ...comments]);
      setNewComment("");
      setReplyingTo(null);
    }
  };

  // Helper function to update nested comments
  const updateCommentTree = (
    comments: Comment[],
    targetId: string,
    updateFn: (comment: Comment) => Comment
  ): Comment[] => {
    return comments.map((comment) => {
      if (comment.id === targetId) {
        return updateFn(comment);
      }
      if (comment.replies) {
        return {
          ...comment,
          replies: updateCommentTree(comment.replies, targetId, updateFn),
        };
      }
      return comment;
    });
  };

  return (
    <div className='flex flex-col h-full'>
      <div className='px-4 py-1.5 border-b flex justify-between items-center bg-white'>
        <h2 className='text-base font-semibold'>Comments</h2>
        <span className='text-sm font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full'>
          {formatCount(comments.length)}
        </span>
      </div>
      <ScrollArea className='flex-1 px-4'>
        {comments.map((comment, index) => (
          <div key={comment.id} className={index === 0 ? "mt-4" : ""}>
            {renderComment(comment)}
          </div>
        ))}
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
                replyingTo ? `Reply to ${replyingTo}...` : "Add a comment..."
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
