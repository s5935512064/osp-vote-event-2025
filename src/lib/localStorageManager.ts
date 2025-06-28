import type { LocalUserActions } from "./types";

const STORAGE_KEY = "osp_vote_user_actions";

export class LocalStorageManager {
  // Get user actions from localStorage
  static getUserActions(userId: string): LocalUserActions | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      const data: LocalUserActions[] = JSON.parse(stored);
      return data.find((user) => user.phone === userId) || null;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return null;
    }
  }

  // Save user actions to localStorage
  static saveUserActions(userActions: LocalUserActions): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let data: LocalUserActions[] = stored ? JSON.parse(stored) : [];

      // Remove existing user data
      data = data.filter((user) => user.phone !== userActions.phone);

      // Add updated user data
      data.push({
        ...userActions,
        lastUpdated: new Date().toISOString(),
      });

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }

  // Add vote to localStorage
  static addVote(userId: string, submissionId: string): void {
    const existing = this.getUserActions(userId) || {
      phone: userId,
      likedSubmissions: [],
      sharedSubmissions: [],
      lastUpdated: new Date().toISOString(),
    };

    existing.votedSubmissionId = submissionId;
    this.saveUserActions(existing);
  }

  // Add like to localStorage
  static addLike(userId: string, submissionId: string): void {
    const existing = this.getUserActions(userId) || {
      phone: userId,
      likedSubmissions: [],
      sharedSubmissions: [],
      lastUpdated: new Date().toISOString(),
    };

    if (!existing.likedSubmissions.includes(submissionId)) {
      existing.likedSubmissions.push(submissionId);
      this.saveUserActions(existing);
    }
  }

  // Remove like from localStorage
  static removeLike(userId: string, submissionId: string): void {
    const existing = this.getUserActions(userId);
    if (!existing) return;

    existing.likedSubmissions = existing.likedSubmissions.filter(
      (id) => id !== submissionId
    );
    this.saveUserActions(existing);
  }

  // Add share to localStorage
  static addShare(userId: string, submissionId: string): void {
    const existing = this.getUserActions(userId) || {
      phone: userId,
      likedSubmissions: [],
      sharedSubmissions: [],
      lastUpdated: new Date().toISOString(),
    };

    if (!existing.sharedSubmissions.includes(submissionId)) {
      existing.sharedSubmissions.push(submissionId);
      this.saveUserActions(existing);
    }
  }

  // Check if user has voted
  static hasVoted(userId: string): boolean {
    const actions = this.getUserActions(userId);
    return !!actions?.votedSubmissionId;
  }

  // Check if user has liked submission
  static hasLiked(userId: string, submissionId: string): boolean {
    const actions = this.getUserActions(userId);
    return actions?.likedSubmissions.includes(submissionId) || false;
  }

  // Check if user has shared submission
  static hasShared(userId: string, submissionId: string): boolean {
    const actions = this.getUserActions(userId);
    return actions?.sharedSubmissions.includes(submissionId) || false;
  }
}
