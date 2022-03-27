export type SomeType<T> = {
  readonly isSome: true;
  readonly value: T;
};

export type NoneType = {
  readonly isSome: false;
};

export type Option<T> = SomeType<T> | NoneType;

export function some<T>(value: T): SomeType<T> {
  return {
    isSome: true,
    value: value,
  };
}

export function none(): NoneType {
  return {
    isSome: false,
  };
}
