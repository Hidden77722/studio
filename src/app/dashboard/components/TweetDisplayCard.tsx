
"use client";

import type { MockTweet } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Repeat2, Heart, Share, BarChart2 } from "lucide-react";
import Image from "next/image";
import React from "react";

interface TweetDisplayCardProps {
  tweet: MockTweet;
}

export function TweetDisplayCard({ tweet }: TweetDisplayCardProps) {
  const [timeAgo, setTimeAgo] = React.useState('');

  React.useEffect(() => {
    const calculateTimeAgo = () => {
      const now = new Date();
      const past = new Date(tweet.timestamp);
      const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

      if (diffInSeconds < 60) {
        setTimeAgo(`${diffInSeconds}s`);
      } else if (diffInSeconds < 3600) {
        setTimeAgo(`${Math.floor(diffInSeconds / 60)}m`);
      } else if (diffInSeconds < 86400) {
        setTimeAgo(`${Math.floor(diffInSeconds / 3600)}h`);
      } else {
        setTimeAgo(past.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }));
      }
    };
    calculateTimeAgo();
    const interval = setInterval(calculateTimeAgo, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [tweet.timestamp]);

  const formatCount = (count: number) => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count.toString();
  };

  return (
    <Card className="w-full shadow-md hover:shadow-primary/10 transition-shadow duration-300 ease-in-out">
      <CardHeader className="flex flex-row items-start space-x-4 p-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={tweet.avatarUrl} alt={tweet.userName} data-ai-hint={tweet.dataAiHint || "profile avatar"} />
          <AvatarFallback>{tweet.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">{tweet.userName}</span>
            <span className="text-sm text-muted-foreground">@{tweet.userHandle}</span>
            <span className="text-sm text-muted-foreground">·</span>
            <span className="text-sm text-muted-foreground hover:underline cursor-pointer">{timeAgo}</span>
          </div>
          <p className="text-sm text-foreground whitespace-pre-wrap mt-1">{tweet.content}</p>
        </div>
      </CardHeader>
      {tweet.imageUrl && (
        <CardContent className="px-4 pt-0 pb-2">
          <Image
            src={tweet.imageUrl}
            alt="Tweet image"
            width={500}
            height={300}
            className="rounded-lg border border-border object-cover w-full max-h-[300px]"
            data-ai-hint={tweet.dataAiHint || "meme coin chart"}
          />
        </CardContent>
      )}
      {tweet.coinTags && tweet.coinTags.length > 0 && (
        <CardContent className="px-4 pt-0 pb-2">
          <div className="flex flex-wrap gap-2">
            {tweet.coinTags.map(tag => (
              <span key={tag} className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full cursor-pointer hover:bg-primary/20">
                ${tag}
              </span>
            ))}
          </div>
        </CardContent>
      )}
      <CardFooter className="flex justify-between items-center p-2 px-4 border-t border-border">
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
          <MessageCircle className="h-4 w-4 mr-1.5" /> {formatCount(tweet.replies)}
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-green-500">
          <Repeat2 className="h-4 w-4 mr-1.5" /> {formatCount(tweet.retweets)}
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-500">
          <Heart className="h-4 w-4 mr-1.5" /> {formatCount(tweet.likes)}
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
          <BarChart2 className="h-4 w-4 mr-1.5" /> {/* View count icon */}
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8">
          <Share className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
