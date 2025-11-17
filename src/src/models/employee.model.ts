export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  salary: number;
  joiningDate: string;
  status: "active" | "inactive";
  address?: string;
  imageUrl?: string;
}
