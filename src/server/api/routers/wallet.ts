import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { wallets } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq, and } from "drizzle-orm";

export const walletRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        balance: z.number().min(0),
      }),
    )
    .output(z.object({}))
    .mutation(async ({ ctx, input }) => {
      const { name, balance } = input;
      const userId = ctx.session.user.id;

      const wallet = (
        await ctx.db
          .insert(wallets)
          .values({
            name,
            balance,
            userId,
          })
          .returning()
      ).at(0);

      if (!wallet) {
        throw new TRPCError({
          message: "ERROR: Failed to create wallet",
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      // await revalidatePath("/dashboard");

      return wallet;
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(wallets);
  }),
  getById: protectedProcedure
    .input(z.object({ walletId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { walletId } = input;
      const userId = ctx.session.user.id;

      const wallet = await ctx.db.query.wallets.findFirst({
        where: and(eq(wallets.id, walletId), eq(wallets.userId, userId)),
      });

      if (!wallet) {
        throw new TRPCError({
          message: "ERROR: No wallet found",
          code: "BAD_REQUEST",
        });
      }

      return wallet;
    }),
  deleteById: protectedProcedure
    .input(
      z.object({
        walletId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { walletId } = input;
      const userId = ctx.session.user.id;

      return await ctx.db
        .delete(wallets)
        .where(and(eq(wallets.userId, userId), eq(wallets.id, walletId)));
    }),
});
