
import { useCallback, useEffect, useState } from "react";

// Backend-free data layer for TaskFlow.
// Tasks are stored per user in localStorage.

const STORAGE_KEY = "taskflowTodos";
const UPDATE_EVENT = "taskflow-todos-updated";

export const apiSlice = {
  reducerPath: "api",
  reducer: (state = {}) => state,
  middleware: () => (next) => (action) => next(action),
};

// ==========================================
// READ TODOS
// ==========================================

function readTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to read TaskFlow todos:", error);
    return [];
  }
}

// ==========================================
// WRITE TODOS
// ==========================================

function writeTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));

  window.dispatchEvent(new Event(UPDATE_EVENT));
}

// ==========================================
// GET USER TODOS
// ==========================================

function getUserTodos(userEmail) {
  const email = userEmail?.trim().toLowerCase();

  if (!email) {
    return [];
  }

  return readTodos().filter(
    (todo) =>
      todo.userEmail?.trim().toLowerCase() === email
  );
}

// ==========================================
// CREATE TODO
// ==========================================

function createTodo(data) {
  return {
    id: Date.now() + Math.random(),
    title: data.title || "",
    completed: Boolean(data.completed),
    dueDate: data.dueDate || "",
    priority: data.priority || "medium",
    category: data.category || "",
    createdAt:
      data.createdAt || new Date().toISOString(),
    userEmail:
      data.userEmail?.trim().toLowerCase() || "",
  };
}

// ==========================================
// UPDATE TODO
// ==========================================

function updateStoredTodo(id, changes, userEmail) {
  const email = userEmail?.trim().toLowerCase();

  const todos = readTodos();

  let updatedTodo = null;

  const nextTodos = todos.map((todo) => {
    const sameId =
      String(todo.id) === String(id);

    const sameUser =
      todo.userEmail?.trim().toLowerCase() === email;

    if (!sameId || !sameUser) {
      return todo;
    }

    updatedTodo = {
      ...todo,
      ...changes,
      userEmail: email,
    };

    return updatedTodo;
  });

  if (!updatedTodo) {
    throw new Error("Task not found");
  }

  writeTodos(nextTodos);

  return updatedTodo;
}

// ==========================================
// TODOS STORE
// ==========================================

function useTodosStore(userEmail) {
  const [todos, setTodos] = useState(() =>
    getUserTodos(userEmail)
  );

  const refresh = useCallback(() => {
    setTodos(getUserTodos(userEmail));
  }, [userEmail]);

  useEffect(() => {
    refresh();

    window.addEventListener(
      UPDATE_EVENT,
      refresh
    );

    window.addEventListener(
      "storage",
      refresh
    );

    return () => {
      window.removeEventListener(
        UPDATE_EVENT,
        refresh
      );

      window.removeEventListener(
        "storage",
        refresh
      );
    };
  }, [refresh]);

  return [todos, refresh];
}

// ==========================================
// GET TODOS QUERY
// ==========================================

export function useGetTodosQuery(
  userEmail,
  options = {}
) {
  const [todos, refresh] =
    useTodosStore(userEmail);

  const skipped = Boolean(options.skip);

  return {
    data: skipped ? undefined : todos,

    isLoading: false,

    isFetching: false,

    isError: false,

    error: null,

    refetch: async () => {
      refresh();

      return {
        data: getUserTodos(userEmail),
      };
    },
  };
}

// ==========================================
// MUTATION HELPER
// ==========================================

function useMutation(operation) {
  const [state, setState] = useState({
    isLoading: false,
    isError: false,
    error: null,
  });

  const mutate = useCallback(
    (payload) => {
      setState({
        isLoading: true,
        isError: false,
        error: null,
      });

      const execute = async () => {
        try {
          const data = operation(payload);

          setState({
            isLoading: false,
            isError: false,
            error: null,
          });

          return data;
        } catch (error) {
          setState({
            isLoading: false,
            isError: true,
            error,
          });

          throw error;
        }
      };

      const promise = execute();

      // RTK Query style .unwrap()
      promise.unwrap = async () => {
        return await promise;
      };

      return promise;
    },
    [operation]
  );

  return [mutate, state];
}

// ==========================================
// ADD TODO
// ==========================================

export function useAddTodoMutation() {
  return useMutation((newTodo) => {
    const todo = createTodo(newTodo);

    const todos = readTodos();

    writeTodos([
      ...todos,
      todo,
    ]);

    return todo;
  });
}

// ==========================================
// UPDATE TODO
// ==========================================

export function useUpdateTodoMutation() {
  return useMutation(
    ({ id, ...changes }) => {
      const userEmail =
        changes.userEmail || "";

      delete changes.userEmail;

      return updateStoredTodo(
        id,
        changes,
        userEmail
      );
    }
  );
}

// ==========================================
// DELETE TODO
// ==========================================

export function useDeleteTodoMutation() {
  return useMutation(
    ({ id, userEmail }) => {
      const email =
        userEmail?.trim().toLowerCase();

      const todos = readTodos();

      const nextTodos = todos.filter(
        (todo) =>
          !(
            String(todo.id) === String(id) &&
            todo.userEmail
              ?.trim()
              .toLowerCase() === email
          )
      );

      writeTodos(nextTodos);

      return {
        id,
      };
    }
  );
}

// ==========================================
// CLEAR COMPLETED TODOS
// ==========================================

export function useClearCompletedTodosMutation() {
  return useMutation((userEmail) => {
    const email =
      userEmail?.trim().toLowerCase();

    const todos = readTodos();

    const nextTodos = todos.filter(
      (todo) =>
        !(
          todo.completed &&
          todo.userEmail
            ?.trim()
            .toLowerCase() === email
        )
    );

    writeTodos(nextTodos);

    return {
      success: true,
    };
  });
}
