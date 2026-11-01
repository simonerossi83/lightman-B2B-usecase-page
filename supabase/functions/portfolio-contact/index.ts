import { createPortfolioHandler } from './handler.mjs';

Deno.serve(createPortfolioHandler(name => Deno.env.get(name)));
