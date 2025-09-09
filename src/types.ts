export type Shift = {
  id?: string;
  logo: string;
  address: string;
  companyName: string;
  dateStartByCity: string;
  timeStartByCity: string;
  timeEndByCity: string;
  currentWorkers: number;
  planWorkers: number;
  workTypes: string;
  priceWorker: number;
  customerFeedbacksCount: number;
  customerRating: number; // 0..5
};

export type Coordinates = {
  latitude: number;
  longitude: number;
};

