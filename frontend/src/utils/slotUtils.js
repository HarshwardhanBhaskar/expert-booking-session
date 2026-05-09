export function createBookedSlotKey(date, slot) {
  return `${date}--${slot}`;
}

export function flattenBookedSlots(bookedSlots = []) {
  return bookedSlots.flatMap(({ date, slots = [] }) =>
    slots.map((slot) => createBookedSlotKey(date, slot))
  );
}

export function addBookedSlot(prevBookedSlots, date, slot) {
  const nextKey = createBookedSlotKey(date, slot);

  if (prevBookedSlots.includes(nextKey)) {
    return prevBookedSlots;
  }

  return [...prevBookedSlots, nextKey];
}
