import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Category, PrayerRequest } from "../backend";
import { useActor } from "./useActor";

export type { PrayerRequest };

export function useGetAllPrayerRequests() {
  const { actor, isFetching } = useActor();
  return useQuery<PrayerRequest[]>({
    queryKey: ["prayerRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPrayerRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitPrayerRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      phone: string;
      category: Category;
      message: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      const phoneNum = data.phone
        ? BigInt(data.phone.replace(/\D/g, ""))
        : null;
      return actor.submitPrayerRequest(
        data.name,
        phoneNum,
        null,
        data.category,
        data.message,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prayerRequests"] });
    },
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useInitializeAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (token: string) => {
      if (!actor) throw new Error("Not connected");
      // @ts-ignore - method exists on actor but not typed in d.ts
      await (actor as any)._initializeAccessControlWithSecret(token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
    },
  });
}
