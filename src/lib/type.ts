
export interface user {
  id: number;
  name: string;
  email: string;
  role: number;
}

export interface Session {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null; 
  };
}

export interface calon {
  id: number;
  name: string;
  img: string;
}

export interface Candidate {
  id: number;
  name: string;
  img: string;
}

export interface Vote {
  id: number;
  candidate: Candidate;
  createdAt: string;
}

export interface Head {
  id: number;
  name: string;
  img: string;
  status: number;
  votes: Vote[];
}


export interface Pemilih {
  id: number;
  name: string;
  kelas: string;
  status: number;
}
