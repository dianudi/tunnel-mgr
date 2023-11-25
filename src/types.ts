interface Tunnel {
  id: number;
  name: string;
  subdomain: string;
  host: string;
  port: number;
  enable: boolean;
  created_at: Date;
  updated_at: Date;
}

export { Tunnel };
