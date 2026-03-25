export interface Preset {
  id: string;
  label: string;
  code: string;
}

export interface ExpandRequest {
  kind: "expand";
  code: string;
  requestId: number;
}

export interface ExpandResponse {
  kind: "result";
  requestId: number;
  types: ExpandedType[];
  error?: string;
}

export interface ExpandedType {
  name: string;
  expanded: string;
}
