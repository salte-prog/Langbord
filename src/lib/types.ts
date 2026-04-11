export interface Member {
  id: string;
  name: string;
  title: string;
  company: string;
  industry: string;
  bio: string;
  imageUrl?: string;
  linkedinUrl?: string;
}

export interface NextMeeting {
  id: string;
  date: string;
  time: string;
  hostName: string;
  hostCompany: string;
  industry: string;
  riddle: string;
  address: string;
  locationDescription: string;
  riddleApproved: boolean;
}

export interface PastMeeting {
  id: string;
  date: string;
  hostName: string;
  hostCompany: string;
  industry: string;
  location: string;
  summary: string;
}
