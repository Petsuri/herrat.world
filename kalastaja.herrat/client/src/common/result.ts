export type SuccessType<S> = {
  readonly ok: true;
  readonly value: S;
};

export function success<T>(value: T): SuccessType<T> {
  return {
    ok: true,
    value: value,
  };
}

export type FailureType<F> = {
  readonly ok: false;
  readonly error: F;
};

export function failure<T>(value: T): FailureType<T> {
  return {
    ok: false,
    error: value,
  };
}

export type Result<S, E> = SuccessType<S> | FailureType<E>;

export function map<S, F, SS>(current: Result<S, F>, f: (value: S) => SS): Result<SS, F> {
  if (current.ok) {
    return success(f(current.value));
  }

  return current;
}

export function bind<S, F, SS>(
  current: Result<S, F>,
  f: (value: S) => Result<SS, F>
): Result<SS, F> {
  if (current.ok) {
    return f(current.value);
  }

  return current;
}

export function match<S, F, T>(
  current: Result<S, F>,
  onSuccess: (value: S) => T,
  onFailure: (value: F) => T
): T {
  if (current.ok) {
    return onSuccess(current.value);
  }

  return onFailure(current.error);
}
