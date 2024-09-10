export interface userCredentials {
  email: string;
  username: string;
  uid: string;
}

export interface userDetails {
  filter(
    arg0: (user: string) => boolean
  ): import("react").SetStateAction<userDetails | null | undefined>;
  uid: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  birthDate: string;
  gender: string;
  address: string;
  country: string;
  city: string;
  title: string;
  description: string;
  profilePhoto?: string;
  photos?: string[];
  likes?: {
    [key: string]: string;
  };
}

export interface chat {
  id: string;
  createdAt: string;
  participants: string[];
  messages?: [
    {
      sender: string;
      text: string;
      date: string;
    }
  ];
}

export interface message {
  sender: string;
  text: string;
  date: string;
}