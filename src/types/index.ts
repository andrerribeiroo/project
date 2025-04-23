export interface Location {
  id_local?: number;
  nome: string;
  estado?: string;
  pais: string;
}

export interface Temperature {
  id?: number;
  data: string;
  horario: string;
  temperatura: number;
  id_local: number;
  local?: Location;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}