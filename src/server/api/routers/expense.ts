import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { expenses, wallets } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { db } from "@/server/db";

async function deleteById(expenseId: string) {
  return await db.delete(expenses).where(eq(expenses.id, expenseId));
}

export const expenseRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        amount: z.number().min(0),
        type: z.enum(["add", "sub"]),
        walletId: z.string(),
        date: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { name, amount, type, walletId, date } = input;
      const wallet = await ctx.db.query.wallets.findFirst({
        where: eq(wallets.id, walletId),
      });

      if (!wallet) {
        throw new TRPCError({
          message: "ERROR: No wallet found",
          code: "BAD_REQUEST",
        });
      }

      const expense = (
        await ctx.db
          .insert(expenses)
          .values({
            name,
            amount,
            type,
            date,
            walletId,
          })
          .returning()
      ).at(0);

      if (!expense) {
        throw new TRPCError({
          message: "ERROR: Failed to create expense",
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      if (type === "add") {
        await ctx.db
          .update(wallets)
          .set({
            balance: wallet.balance + amount,
          })
          .where(eq(wallets.id, walletId));
      } else if (type === "sub") {
        if (amount > wallet.balance) {
          throw new TRPCError({
            message: "ERROR: Amount cannot exceed balance",
            code: "BAD_REQUEST",
          });
        }
        await ctx.db
          .update(wallets)
          .set({
            balance: wallet.balance - amount,
          })
          .where(eq(wallets.id, walletId));
      }

      return expense;
    }),
  getAll: protectedProcedure
    .input(
      z.object({
        walletId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { walletId } = input;

      const dbExpenses = await ctx.db
        .select()
        .from(expenses)
        .where(eq(expenses.walletId, walletId));

      return dbExpenses;
    }),
  deleteByIds: protectedProcedure
    .input(
      z.object({
        expenseIds: z.array(z.string()),
      }),
    )
    .mutation(async ({ input }) => {
      const { expenseIds } = input;

      const promises = expenseIds.map((id) => deleteById(id));
      const results = await Promise.allSettled(promises);

      const errors = results.filter((r) => r.status === "rejected");
      // const successes = results.filter((r) => r.status === "fulfilled");

      return errors;
    }),
});
