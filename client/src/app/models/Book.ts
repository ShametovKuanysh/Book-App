export interface Book {
    id: number;
    title: string;
    author: string;
    fileUrl: string;
    description: string;
    coverImage: string;
    rating: number;
    categories: string[];
    publishDate: Date;
    fileType: string;
}