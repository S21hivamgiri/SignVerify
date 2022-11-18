export interface PredictionRequest {
    uid: string;
    file: File;
}

export interface PredictionResponse {
    matchingPercent: string;
    accuracy: string;
    image: string;
    id:string;
}