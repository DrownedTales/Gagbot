import { Message, Snowflake } from "discord.js";

type FixedSizeArray<N extends number, T> = { length: N } & ReadonlyArray<T>;

/**
 * Returns true if the user fumbles and false if not.
 * This function handles optins and persistent state.
 * IMPORTANT: A single user action should never cause this function to be called multiple times. If multiple results are needed, use {@link rollKeyFumbleN} to get all possibly needed results.
 * @param user
 */
export function rollKeyFumble(user: Snowflake): boolean;

/**
 * Acts as if {@link rollKeyFumble} was called several times, but without causing issues with cooldown and blessed luck.
 * This function handles optins and persistent state.
 * IMPORTANT: A single user action should never cause this function to be called multiple times
 * @param user
 * @param n The number of results needed.
 */
export function rollKeyFumbleN<S extends number>(user: Snowflake, n: S): FixedSizeArray<S, boolean>;

/**
 * Returns a non-negative number representing the base fumble chance for the user.
 * 0 means no fumbles, 1+ means always fumbles.
 * Note: The returned value may exceed 1.
 * @param user
 */
export function getFumbleChance(user: Snowflake): number;

/**
 * Handles users being able to find keys from sending a message.
 * Should be called once for every message that is allowed to find keys.
 * @param user
 */
export function handleKeyFinding(message: Message): Promise<void>;
