import mongoose, { ClientSession } from 'mongoose';

export const runTransaction = async <T>(
  fx: (session: ClientSession) => Promise<T>
): Promise<T> => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const result = await fx(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    if (session.inTransaction()) {
      try {
        await session.abortTransaction();
      } catch (abortError) {
        // Log abort failure but preserve original error
        console.error('Failed to abort transaction:', abortError);
      }
    }
    throw error;
  } finally {
    try {
      await session.endSession();
    } catch (endError) {
      console.error('Failed to end session:', endError);
    }
  }
};
