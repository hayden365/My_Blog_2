export interface ProjectFormData {
  _id: string;
  title: string;
  language: string;
  frontend_tech: string;
  backend_tech: string;
  isGroupProject: boolean;
  myRole: string;
  description: string;
  startDate: string;
  endDate: string;
  isOngoing: boolean;
  links?: {
    github: string;
    notion: string;
    demo: string;
    figma: string;
  };
  coverImg: string;
  createdAt: string;
}

export interface ProjectData {
  _id: string;
  title: string;
  language: string;
  frontend_tech: string[];
  backend_tech: string[];
  isGroupProject: boolean;
  myRole: string;
  description: string;
  startDate: string;
  endDate: string;
  isOngoing: boolean;
  links?: {
    github: string;
    notion: string;
    demo: string;
    figma: string;
  };
  coverImg: string;
  createdAt: string;
}
