import { useState, useEffect, useCallback } from "react";
import { GalleryService } from "./galleryService";
import { LocalStorageManager } from "./localStorageManager";
import type { VoteStatus, LikeAction, ShareAction } from "./types";

export function useUserActions(campaignId?: string, userPhone?: string) {
  const [voteStatus, setVoteStatus] = useState<VoteStatus>({ hasVoted: false });
  const [likedSubmissions, setLikedSubmissions] = useState<Set<string>>(
    new Set()
  );
  const [sharedSubmissions, setSharedSubmissions] = useState<Set<string>>(
    new Set()
  );
  const [loading, setLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    if (!campaignId || !userPhone) return;

    const loadUserActions = async () => {
      setLoading(true);
      try {
        // Load from localStorage first (instant)
        const localActions = LocalStorageManager.getUserActions(userPhone);
        if (localActions) {
          setVoteStatus({
            hasVoted: !!localActions.votedSubmissionId,
            votedSubmissionId: localActions.votedSubmissionId,
          });
          setLikedSubmissions(new Set(localActions.likedSubmissions));
          setSharedSubmissions(new Set(localActions.sharedSubmissions));
        }

        // Then sync with API
        const [apiVoteStatus, apiUserActions] = await Promise.all([
          GalleryService.checkVoteStatus(campaignId),
          GalleryService.getUserActions(campaignId, userPhone),
        ]);

        // Update state with API data
        setVoteStatus(apiVoteStatus);
        setLikedSubmissions(new Set(apiUserActions.likedSubmissions));
        setSharedSubmissions(new Set(apiUserActions.sharedSubmissions));

        // Update localStorage with API data
        LocalStorageManager.saveUserActions({
          phone: userPhone,
          votedSubmissionId: apiVoteStatus.votedSubmissionId,
          likedSubmissions: apiUserActions.likedSubmissions,
          sharedSubmissions: apiUserActions.sharedSubmissions,
          lastUpdated: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Error loading user actions:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserActions();
  }, [campaignId, userPhone]);

  // Submit like
  const submitLike = useCallback(
    async (submissionId: string): Promise<void> => {
      if (!campaignId || !userPhone)
        throw new Error("Campaign ID and user phone required");

      const isCurrentlyLiked = likedSubmissions.has(submissionId);

      try {
        // Optimistic update
        if (isCurrentlyLiked) {
          setLikedSubmissions((prev) => {
            const newSet = new Set(prev);
            newSet.delete(submissionId);
            return newSet;
          });
          LocalStorageManager.removeLike(userPhone, submissionId);
        } else {
          setLikedSubmissions((prev) => new Set([...prev, submissionId]));
          LocalStorageManager.addLike(userPhone, submissionId);
        }

        // Submit to API
        await GalleryService.submitLike(campaignId, {
          submissionId,
          voterPhone: userPhone,
        });
      } catch (error) {
        // Revert optimistic update on error
        if (isCurrentlyLiked) {
          setLikedSubmissions((prev) => new Set([...prev, submissionId]));
          LocalStorageManager.addLike(userPhone, submissionId);
        } else {
          setLikedSubmissions((prev) => {
            const newSet = new Set(prev);
            newSet.delete(submissionId);
            return newSet;
          });
          LocalStorageManager.removeLike(userPhone, submissionId);
        }
        throw error;
      }
    },
    [campaignId, userPhone, likedSubmissions]
  );

  // Submit share
  const submitShare = useCallback(
    async (
      submissionId: string,
      platform: "facebook" | "line" | "twitter" | "copy" = "copy"
    ): Promise<void> => {
      if (!campaignId || !userPhone)
        throw new Error("Campaign ID and user phone required");

      try {
        // Optimistic update
        if (!sharedSubmissions.has(submissionId)) {
          setSharedSubmissions((prev) => new Set([...prev, submissionId]));
          LocalStorageManager.addShare(userPhone, submissionId);
        }

        // Submit to API
        await GalleryService.submitShare(campaignId, {
          submissionId,
          voterPhone: userPhone,
          platform,
        });
      } catch (error) {
        // Revert optimistic update on error
        setSharedSubmissions((prev) => {
          const newSet = new Set(prev);
          newSet.delete(submissionId);
          return newSet;
        });
        console.error("Error submitting share:", error);
        throw error;
      }
    },
    [campaignId, userPhone]
  );

  // Check functions
  const hasVoted = useCallback((): boolean => {
    return voteStatus.hasVoted;
  }, [voteStatus.hasVoted]);

  const hasLiked = useCallback(
    (submissionId: string): boolean => {
      return likedSubmissions.has(submissionId);
    },
    [likedSubmissions]
  );

  const hasShared = useCallback(
    (submissionId: string): boolean => {
      return sharedSubmissions.has(submissionId);
    },
    [sharedSubmissions]
  );

  return {
    voteStatus,
    likedSubmissions,
    sharedSubmissions,
    loading,
    submitLike,
    submitShare,
    hasVoted,
    hasLiked,
    hasShared,
  };
}
