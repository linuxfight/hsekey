import { z } from "zod";
import {TokenInputSchema} from "./auth";

export const PaginationInputSchema = TokenInputSchema.extend({
    page: z.number().min(1),
    limit: z.number().min(4).max(20),
});

export const SearchInputSchema = PaginationInputSchema.extend({
    query: z.string().min(1).max(1000),
});

export const BuyInputSchema = TokenInputSchema.extend({
    productId: z.number().min(1),
})

export const ProductCreateInputSchema = TokenInputSchema.extend({
    name: z.string().min(1).max(255),
    price: z.number().min(1).max(255),
    amount: z.number().min(1),
    imageUrl: z.url().min(1).max(255),
    token: z.string().min(60).max(120),
});