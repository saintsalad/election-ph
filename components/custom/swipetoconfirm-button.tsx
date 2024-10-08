import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Check } from "lucide-react";

interface SwipeToConfirmProps {
  onConfirm: () => void;
  className?: string;
}

export function SwipeToConfirm({ onConfirm, className }: SwipeToConfirmProps) {
  // State for tracking completion, dragging, and position
  const [isComplete, setIsComplete] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(0);

  // Refs for DOM elements and drag tracking
  const buttonRef = useRef<HTMLButtonElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const buttonWidth = useRef(0);

  // Constants for layout
  const ICON_WIDTH = 48;
  const END_PADDING = 16 / 2; // Add padding at the end

  // Handler for starting the drag operation
  const handleDragStart = (clientX: number) => {
    if (isComplete) return;
    startX.current = clientX - position;
    setIsDragging(true);
    if (buttonRef.current) {
      // Calculate draggable width (button width minus icon width and end padding)
      buttonWidth.current =
        buttonRef.current.offsetWidth - ICON_WIDTH - END_PADDING;
    }
  };

  // Handler for drag movement
  const handleDragMove = (clientX: number) => {
    if (!isDragging || isComplete) return;
    // Calculate new position, constrained within button bounds
    const newPosition = Math.max(
      0,
      Math.min(clientX - startX.current, buttonWidth.current)
    );
    setPosition(newPosition);

    // Check if drag is complete and trigger confirmation
    if (newPosition >= buttonWidth.current) {
      setIsComplete(true);
      onConfirm();
    }
  };

  // Handler for ending the drag operation
  const handleDragEnd = () => {
    setIsDragging(false);
    if (!isComplete) {
      setPosition(0); // Reset position if not completed
    }
  };

  // Effect for setting up event listeners
  useEffect(() => {
    const button = buttonRef.current;
    const icon = iconRef.current;
    if (!button || !icon) return;

    // Mouse event handlers
    const handleMouseDown = (e: MouseEvent) => handleDragStart(e.clientX);
    const handleMouseMove = (e: MouseEvent) => handleDragMove(e.clientX);
    const handleMouseUp = handleDragEnd;

    // Touch event handlers
    const handleTouchStart = (e: TouchEvent) =>
      handleDragStart(e.touches[0].clientX);
    const handleTouchMove = (e: TouchEvent) =>
      handleDragMove(e.touches[0].clientX);
    const handleTouchEnd = handleDragEnd;

    // Attach event listeners
    icon.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    icon.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    // Cleanup function to remove event listeners
    return () => {
      icon.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);

      icon.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging, isComplete, onConfirm]);

  return (
    <Button
      ref={buttonRef}
      className={cn(
        "relative overflow-hidden w-full max-w-sm h-14 text-white rounded-full",
        "transition-all duration-300 ease-in-out",
        isComplete
          ? "bg-green-500 hover:bg-green-600"
          : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700",
        isDragging && !isComplete ? "shadow-lg scale-[1.02]" : "",
        className
      )}
      disabled={isComplete}>
      {/* Animated background - only shown before completion */}
      {!isComplete && (
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500",
            "transition-transform duration-300 ease-in-out",
            "translate-x-[-100%]"
          )}
        />
      )}

      {/* Button text */}
      <span
        className={cn(
          "relative z-10 font-semibold",
          "transition-all duration-300 ease-in-out",
          isDragging && !isComplete && "opacity-0 scale-90"
        )}>
        {isComplete ? "Confirmed" : "Slide to confirm"}
      </span>

      {/* Draggable icon - only shown before completion */}
      {!isComplete && (
        <div
          ref={iconRef}
          className={cn(
            "absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full",
            "bg-white shadow-md flex items-center justify-center",
            "cursor-grab active:cursor-grabbing",
            "transition-all duration-300 ease-in-out",
            isDragging && "scale-110 shadow-lg"
          )}
          style={{
            transform: `translateX(${position}px) translateY(-50%)`,
            transition: isDragging ? "none" : "all 0.3s ease-out",
          }}>
          <ArrowRight
            className={cn(
              "w-6 h-6 text-blue-500",
              "transition-all duration-300 ease-in-out",
              isDragging && "animate-pulse"
            )}
          />
        </div>
      )}

      {/* Success icon - only shown after completion */}
      {isComplete && (
        <Check className='absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-white' />
      )}
    </Button>
  );
}
