export interface IAbiField {
    name: string;
    type: string;
}

export interface IAbi {
    method: string; // method name
    inputs: IAbiField[]; // method args
    outputs: IAbiField[]; // method returns
    hash: IAbiField; // 4-bytes method identifier
}
