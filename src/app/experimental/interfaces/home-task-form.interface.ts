export interface Employee {
  firstName: string;
  secondName: string;
  lastName: string;
  email: string;
}

export interface Department {
  name: string;
  value: string | null;
}

export interface Service {
  serviceName: string;
  compoundServices: string[];
}
