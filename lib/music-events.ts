/**
 * Window events that let other parts of the page talk to the background music
 * (which lives in InvitationShell) — e.g. the prenup teaser pauses the song
 * while it plays, and hands it back when it ends.
 */
export const PAUSE_MUSIC = "invitation:pause-music";
export const RESUME_MUSIC = "invitation:resume-music";
