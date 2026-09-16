import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  toggleDarkMode,
} from "./features/ui/uiSlice";

import {
  logout,
} from "./features/auth/authActions";

import {
  useGetTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
  useClearCompletedTodosMutation,
} from "./features/api/apiSlice";

import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useMemo,
  useCallback,
  useId,
  useTransition,
  useSyncExternalStore,
  useActionState,
  useEffectEvent,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useTranslation,
} from "react-i18next";

import Header from "./components/Header";
import TaskForm from "./components/TaskForm";
import TaskControls from "./components/TaskControls";
import TaskStats from "./components/TaskStats";
import ProgressBar from "./components/ProgressBar";
import TaskList from "./components/TaskList";
import LoadingState from "./components/LoadingState";
import EmptyState from "./components/EmptyState";
import Sidebar from "./components/Sidebar";
import WorkspacePanel from "./components/WorkspacePanel";

import "./App.css";


// ==========================================
// ONLINE / OFFLINE
// ==========================================

function subscribeToOnlineStatus(callback) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);

  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function getOnlineStatus() {
  return navigator.onLine;
}


// ==========================================
// GET CURRENT USER
// ==========================================

function getCurrentUser() {
  try {
    const sessionUser =
      sessionStorage.getItem("user");

    if (sessionUser) {
      const parsedUser = JSON.parse(sessionUser);

      if (
        parsedUser &&
        typeof parsedUser === "object"
      ) {
        return parsedUser;
      }
    }

    const localUser =
      localStorage.getItem("user");

    if (localUser) {
      const parsedUser = JSON.parse(localUser);

      if (
        parsedUser &&
        typeof parsedUser === "object"
      ) {
        return parsedUser;
      }
    }

    return null;
  } catch (error) {
    console.error(
      "Failed to load current user:",
      error
    );

    return null;
  }
}


// ==========================================
// TODO APP
// ==========================================

function TodoApp() {
  const navigate = useNavigate();

  const {
    t,
    i18n,
  } = useTranslation();

  const dispatch = useDispatch();


  // ========================================
  // CURRENT USER
  // ========================================

  const [
    currentUser,
    setCurrentUser,
  ] = useState(() => getCurrentUser());

  const currentUserEmail =
    currentUser?.email
      ?.trim()
      .toLowerCase() || "";


  // ========================================
  // UPDATE USER WHEN STORAGE CHANGES
  // ========================================

  useEffect(() => {
    const updateCurrentUser = () => {
      setCurrentUser(getCurrentUser());
    };

    window.addEventListener(
      "storage",
      updateCurrentUser
    );

    return () => {
      window.removeEventListener(
        "storage",
        updateCurrentUser
      );
    };
  }, []);


  // ========================================
  // RTK QUERY
  // ========================================

  const {
    data: apiTodos,
    isLoading,
    isError,
    refetch,
  } = useGetTodosQuery(
    currentUserEmail,
    {
      skip: !currentUserEmail,
    }
  );


  // ========================================
  // RTK MUTATIONS
  // ========================================

  const [
    addTodo,
  ] = useAddTodoMutation();

  const [
    updateTodo,
  ] = useUpdateTodoMutation();

  const [
    deleteTodo,
  ] = useDeleteTodoMutation();

  const [
    clearCompletedTodos,
  ] = useClearCompletedTodosMutation();


  // ========================================
  // THEME
  // ========================================

  const darkMode =
    useSelector(
      (state) => state.ui.darkMode
    );


  // ========================================
  // FORM IDS
  // ========================================

  const taskId = useId();
  const categoryId = useId();
  const dateId = useId();
  const priorityId = useId();


  // ========================================
  // FORM STATE
  // ========================================

  const [
    taskText,
    setTaskText,
  ] = useState("");

  const [
    dueDate,
    setDueDate,
  ] = useState("");

  const [
    priority,
    setPriority,
  ] = useState("medium");

  const [
    category,
    setCategory,
  ] = useState("");


  // ========================================
  // SIDEBAR / ACTIVE VIEW
  // ========================================

  const [
    activeView,
    setActiveView,
  ] = useState(
    () =>
      localStorage.getItem(
        "todoActiveView"
      ) || "dashboard"
  );

  const [
    mobileSidebarOpen,
    setMobileSidebarOpen,
  ] = useState(false);

  useEffect(() => {
    localStorage.setItem(
      "todoActiveView",
      activeView
    );
  }, [activeView]);


  // ========================================
  // FILTER / SEARCH
  // ========================================

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    filter,
    setFilter,
  ] = useState("all");

  const [
    categoryFilter,
    setCategoryFilter,
  ] = useState("all");

  const [
    sortBy,
    setSortBy,
  ] = useState("newest");


  // ========================================
  // EDIT / NOTIFICATION
  // ========================================

  const [
    editId,
    setEditId,
  ] = useState(null);

  const [
    completedTask,
    setCompletedTask,
  ] = useState(null);

  const [
    taskMessage,
    setTaskMessage,
  ] = useState("");


  // ========================================
  // REFS
  // ========================================

  const taskInputRef =
    useRef(null);

  const taskListRef =
    useRef(null);

  const previousTasksRef =
    useRef([]);

  const notificationTimerRef =
    useRef(null);

  const messageTimerRef =
    useRef(null);


  // ========================================
  // NORMALIZE TODOS
  // ========================================

  const tasks = useMemo(() => {
    if (!apiTodos) {
      return [];
    }

    return apiTodos.map((todo) => ({
      id: todo.id,

      text: todo.title,

      completed:
        Boolean(todo.completed),

      dueDate:
        todo.dueDate || "",

      priority:
        todo.priority || "medium",

      category:
        todo.category || "",

      createdAt:
        todo.createdAt ||
        new Date().toISOString(),

      userEmail:
        todo.userEmail || "",
    }));
  }, [apiTodos]);


  // ========================================
  // SEARCH TRANSITION
  // ========================================

  const [
    isPending,
    startTransition,
  ] = useTransition();


  // ========================================
  // ONLINE STATUS
  // ========================================

  const isOnline =
    useSyncExternalStore(
      subscribeToOnlineStatus,
      getOnlineStatus,
      getOnlineStatus
    );


  // ========================================
  // TASK ACTION
  // ========================================

  const taskAction = async (
    previousState,
    formData
  ) => {
    const text =
      formData
        .get("taskText")
        ?.toString()
        .trim() || "";

    const selectedDate =
      formData
        .get("dueDate")
        ?.toString() || "";

    const selectedPriority =
      formData
        .get("priority")
        ?.toString() ||
      "medium";

    const selectedCategory =
      formData
        .get("category")
        ?.toString()
        .trim() || "";


    // VALIDATION

    if (!text) {
      return {
        success: false,
        message: t("pleaseEnterTask"),
      };
    }

    if (!selectedCategory) {
      return {
        success: false,
        message: t("pleaseEnterCategory"),
      };
    }

    if (!currentUserEmail) {
      return {
        success: false,
        message: t("userNotFound"),
      };
    }


    // UPDATE

    if (editId !== null) {
      try {
        await updateTodo({
          id: editId,
          title: text,
          priority: selectedPriority,
          category: selectedCategory,
          dueDate: selectedDate,
          userEmail: currentUserEmail,
        }).unwrap();

        setEditId(null);
        setTaskText("");
        setDueDate("");
        setPriority("medium");
        setCategory("");

        setTaskMessage(
          t("taskUpdated")
        );

        if (messageTimerRef.current) {
          clearTimeout(
            messageTimerRef.current
          );
        }

        messageTimerRef.current =
          setTimeout(() => {
            setTaskMessage("");
          }, 2500);

        return {
          success: true,
          message: "",
        };
      } catch (error) {
        console.error(
          "Failed to update task:",
          error
        );

        return {
          success: false,
          message: t("failedUpdate"),
        };
      }
    }


    // ADD

    try {
      await addTodo({
        title: text,
        priority: selectedPriority,
        category: selectedCategory,
        dueDate: selectedDate,
        userEmail: currentUserEmail,
      }).unwrap();
    } catch (error) {
      console.error(
        "Failed to add task:",
        error
      );

      return {
        success: false,
        message: t("failedAdd"),
      };
    }


    // RESET

    setTaskText("");
    setDueDate("");
    setPriority("medium");
    setCategory("");

    setTaskMessage(
      t("taskAdded")
    );

    if (messageTimerRef.current) {
      clearTimeout(
        messageTimerRef.current
      );
    }

    messageTimerRef.current =
      setTimeout(() => {
        setTaskMessage("");
      }, 2500);

    return {
      success: true,
      message: "",
    };
  };


  // ========================================
  // useActionState
  // ========================================

  const [
    actionState,
    formAction,
    isActionPending,
  ] = useActionState(
    taskAction,
    {
      success: false,
      message: "",
    }
  );


  // ========================================
  // DOCUMENT TITLE
  // ========================================

  useEffect(() => {
    document.title =
      `${t("appTitle")} (${tasks.length})`;
  }, [tasks.length, t]);


  // ========================================
  // RTL / LTR
  // ========================================

  useEffect(() => {
    const direction =
      i18n.language === "ur"
        ? "rtl"
        : "ltr";

    document.documentElement.dir =
      direction;

    document.documentElement.lang =
      i18n.language;
  }, [i18n.language]);


  // ========================================
  // FOCUS WHEN EDITING
  // ========================================

  useEffect(() => {
    if (
      editId !== null &&
      taskInputRef.current
    ) {
      taskInputRef.current.focus();
    }
  }, [editId]);


  // ========================================
  // CLEANUP
  // ========================================

  useEffect(() => {
    return () => {
      if (messageTimerRef.current) {
        clearTimeout(
          messageTimerRef.current
        );
      }

      if (
        notificationTimerRef.current
      ) {
        clearTimeout(
          notificationTimerRef.current
        );
      }
    };
  }, []);


  // ========================================
  // useLayoutEffect
  // ========================================

  useLayoutEffect(() => {
    if (taskListRef.current) {
      console.log(
        "Task list height:",
        taskListRef.current.offsetHeight
      );
    }
  }, [tasks]);


  // ========================================
  // COMPLETION NOTIFICATION
  // ========================================

  const showCompletedNotification =
    useEffectEvent((task) => {
      setCompletedTask(task);

      if (
        notificationTimerRef.current
      ) {
        clearTimeout(
          notificationTimerRef.current
        );
      }

      notificationTimerRef.current =
        setTimeout(() => {
          setCompletedTask(null);
        }, 2500);
    });


  // ========================================
  // DETECT NEWLY COMPLETED
  // ========================================

  useEffect(() => {
    const previousTasks =
      previousTasksRef.current;

    const newlyCompleted =
      tasks.find((task) => {
        const oldTask =
          previousTasks.find(
            (old) =>
              old.id === task.id
          );

        return (
          task.completed &&
          oldTask &&
          !oldTask.completed
        );
      });

    if (newlyCompleted) {
      showCompletedNotification(
        newlyCompleted
      );
    }

    previousTasksRef.current =
      tasks;
  }, [
    tasks,
    showCompletedNotification,
  ]);


  // ========================================
  // FORM SUBMIT
  // ========================================

  const handleSubmit =
    useCallback(
      (e) => {
        e.preventDefault();

        const formData =
          new FormData(
            e.currentTarget
          );

        formAction(formData);
      },
      [formAction]
    );


  // ========================================
  // EDIT TASK
  // ========================================

  const handleEdit =
    useCallback((task) => {
      setEditId(task.id);
      setTaskText(task.text || "");
      setDueDate(task.dueDate || "");
      setPriority(
        task.priority || "medium"
      );
      setCategory(task.category || "");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, []);


  // ========================================
  // DELETE TASK
  // ========================================

  const handleDelete =
    useCallback(
      async (id) => {
        try {
          await deleteTodo({
            id,
            userEmail:
              currentUserEmail,
          }).unwrap();

          setTaskMessage(
            t("taskDeleted")
          );

          if (
            messageTimerRef.current
          ) {
            clearTimeout(
              messageTimerRef.current
            );
          }

          messageTimerRef.current =
            setTimeout(() => {
              setTaskMessage("");
            }, 2500);
        } catch (error) {
          console.error(
            "Failed to delete task:",
            error
          );

          setTaskMessage(
            t("failedDelete")
          );
        }
      },
      [
        deleteTodo,
        currentUserEmail,
        t,
      ]
    );


  // ========================================
  // TOGGLE TASK
  // ========================================

  const handleToggle =
    useCallback(
      async (id) => {
        const task =
          tasks.find(
            (item) =>
              item.id === id
          );

        if (!task) {
          return;
        }

        try {
          await updateTodo({
            id: task.id,
            completed:
              !task.completed,
            userEmail:
              currentUserEmail,
          }).unwrap();
        } catch (error) {
          console.error(
            "Failed to update task:",
            error
          );
        }
      },
      [
        tasks,
        updateTodo,
        currentUserEmail,
      ]
    );


  // ========================================
  // CLEAR COMPLETED
  // ========================================

  const clearCompleted =
    useCallback(
      async () => {
        try {
          await clearCompletedTodos(
            currentUserEmail
          ).unwrap();

          setTaskMessage(
            t("completedCleared")
          );

          if (
            messageTimerRef.current
          ) {
            clearTimeout(
              messageTimerRef.current
            );
          }

          messageTimerRef.current =
            setTimeout(() => {
              setTaskMessage("");
            }, 2500);
        } catch (error) {
          console.error(
            "Failed to clear completed tasks:",
            error
          );

          setTaskMessage(
            t("failedClear")
          );
        }
      },
      [
        clearCompletedTodos,
        currentUserEmail,
        t,
      ]
    );


  // ========================================
  // CANCEL EDIT
  // ========================================

  const cancelEdit =
    useCallback(() => {
      setEditId(null);
      setTaskText("");
      setDueDate("");
      setPriority("medium");
      setCategory("");
    }, []);


  // ========================================
  // SEARCH
  // ========================================

  const handleSearch =
    useCallback(
      (e) => {
        const value =
          e.target.value;

        startTransition(() => {
          setSearch(value);
        });
      },
      [startTransition]
    );


  // ========================================
  // CATEGORIES
  // ========================================

  const categories =
    useMemo(() => {
      return [
        ...new Set(
          tasks
            .map(
              (task) =>
                task.category
            )
            .filter(Boolean)
        ),
      ];
    }, [tasks]);


  // ========================================
  // FILTER TASKS
  // ========================================

  const filteredTasks =
    useMemo(() => {
      return tasks.filter((task) => {
        const text =
          typeof task?.text ===
          "string"
            ? task.text
            : "";

        const matchesSearch =
          text
            .toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const matchesStatus =
          filter === "all"
            ? true
            : filter === "active"
            ? !task.completed
            : task.completed;

        const matchesCategory =
          categoryFilter === "all"
            ? true
            : task.category ===
              categoryFilter;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesCategory
        );
      });
    }, [
      tasks,
      search,
      filter,
      categoryFilter,
    ]);


  // ========================================
  // SORT TASKS
  // ========================================

  const sortedTasks =
    useMemo(() => {
      const sorted =
        [...filteredTasks];

      const priorityValue = {
        high: 3,
        medium: 2,
        low: 1,
      };

      if (sortBy === "newest") {
        sorted.sort(
          (a, b) =>
            new Date(
              b.createdAt
            ) -
            new Date(
              a.createdAt
            )
        );
      }

      if (sortBy === "oldest") {
        sorted.sort(
          (a, b) =>
            new Date(
              a.createdAt
            ) -
            new Date(
              b.createdAt
            )
        );
      }

      if (sortBy === "priority") {
        sorted.sort(
          (a, b) =>
            priorityValue[
              b.priority
            ] -
            priorityValue[
              a.priority
            ]
        );
      }

      if (sortBy === "dueDate") {
        sorted.sort((a, b) => {
          if (!a.dueDate) {
            return 1;
          }

          if (!b.dueDate) {
            return -1;
          }

          return (
            new Date(a.dueDate) -
            new Date(b.dueDate)
          );
        });
      }

      return sorted;
    }, [
      filteredTasks,
      sortBy,
    ]);


  // ========================================
  // SMART SIDEBAR FILTER
  // ========================================

  const displayTasks =
    useMemo(() => {
      const today =
        new Date().toLocaleDateString(
          "en-CA"
        );

      if (
        activeView ===
        "important"
      ) {
        return sortedTasks.filter(
          (task) =>
            task.priority ===
            "high"
        );
      }

      if (
        activeView === "today"
      ) {
        return sortedTasks.filter(
          (task) =>
            task.dueDate ===
            today
        );
      }

      if (
        activeView ===
        "upcoming"
      ) {
        return sortedTasks.filter(
          (task) =>
            !task.completed &&
            task.dueDate &&
            task.dueDate >= today
        );
      }

      if (
        activeView ===
        "completed"
      ) {
        return sortedTasks.filter(
          (task) =>
            task.completed
        );
      }

      return sortedTasks;
    }, [
      activeView,
      sortedTasks,
    ]);


  // ========================================
  // STATISTICS
  // ========================================

  const totalTasks =
    tasks.length;

  const completedTasks =
    tasks.filter(
      (task) =>
        task.completed
    ).length;

  const activeTasks =
    totalTasks -
    completedTasks;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round(
          (
            completedTasks /
            totalTasks
          ) * 100
        );


  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout =
    useCallback(() => {
      dispatch(logout());

      localStorage.removeItem(
        "isLoggedIn"
      );

      localStorage.removeItem(
        "user"
      );

      sessionStorage.removeItem(
        "isLoggedIn"
      );

      sessionStorage.removeItem(
        "user"
      );

      navigate("/login");
    }, [
      dispatch,
      navigate,
    ]);


  // ========================================
  // LANGUAGE
  // ========================================

  const handleLanguageChange =
    useCallback(
      (language) => {
        i18n.changeLanguage(
          language
        );
      },
      [i18n]
    );


  // ========================================
  // DARK MODE
  // ========================================

  const handleToggleDarkMode =
    useCallback(() => {
      dispatch(
        toggleDarkMode()
      );
    }, [dispatch]);


  // ========================================
  // LOADING
  // ========================================

  if (isLoading) {
    return (
      <div
        className={
          darkMode
            ? "app dark-mode"
            : "app"
        }
      >
        <div className="todo-container">
          <LoadingState />
        </div>
      </div>
    );
  }


  // ========================================
  // ERROR
  // ========================================

  if (isError) {
    return (
      <div
        className={
          darkMode
            ? "app dark-mode"
            : "app"
        }
      >
        <div className="todo-container">
          <EmptyState
            icon="⚠️"
            title={t("backendFailed")}
            description={t(
              "backendDescription"
            )}
          />
        </div>
      </div>
    );
  }


  // ========================================
  // TASK VIEWS
  // ========================================

  const isTaskView = [
    "dashboard",
    "tasks",
    "today",
    "important",
    "upcoming",
    "completed",
  ].includes(activeView);


  // ========================================
  // UI
  // ========================================

  return (
    <div
      className={
        darkMode
          ? "app dark-mode"
          : "app"
      }
    >

      {/* SIDEBAR */}

      <Sidebar
        activeView={activeView}
        onNavigate={setActiveView}
        onLogout={handleLogout}
        currentUser={currentUser}
        mobileOpen={
          mobileSidebarOpen
        }
        onClose={() =>
          setMobileSidebarOpen(
            false
          )
        }
      />


      {/* WORKSPACE */}

      <div className="workspace-shell">

        {/* MOBILE MENU */}

        <button
          type="button"
          className="mobile-menu-button"
          onClick={() =>
            setMobileSidebarOpen(
              true
            )
          }
          aria-label={
            t("sidebar.mainNavigation")
          }
        >
          ☰
        </button>


        {/* HEADER */}

        <Header
          isOnline={isOnline}
        />


        {/* OTHER WORKSPACE PAGES */}

        {!isTaskView && (
          <WorkspacePanel
            view={activeView}
            tasks={tasks}
            categories={categories}
            currentUser={currentUser}
            isOnline={isOnline}
            darkMode={darkMode}
            onToggleDarkMode={
              handleToggleDarkMode
            }
            language={
              i18n.language
            }
            onLanguageChange={
              handleLanguageChange
            }
            refetch={refetch}
            setCategoryFilter={
              setCategoryFilter
            }
            setActiveView={
              setActiveView
            }
          />
        )}


        {/* TASK VIEWS */}

        {isTaskView && (
          <main className="todo-container is-task-view">

            {/* TASK FORM */}

            <TaskForm
              taskText={taskText}
              dueDate={dueDate}
              priority={priority}
              category={category}
              editId={editId}
              taskInputId={taskId}
              dueDateId={dateId}
              priorityId={priorityId}
              categoryId={categoryId}
              taskMessage={taskMessage}
              formError={
                actionState.message &&
                !actionState.success
                  ? actionState.message
                  : ""
              }
              isPending={
                isActionPending
              }
              onTaskTextChange={
                setTaskText
              }
              onDueDateChange={
                setDueDate
              }
              onPriorityChange={
                setPriority
              }
              onCategoryChange={
                setCategory
              }
              onSubmit={
                handleSubmit
              }
              onCancel={
                cancelEdit
              }
              taskInputRef={
                taskInputRef
              }
            />


            {/* CONTROLS */}

            <TaskControls
              search={search}
              filter={filter}
              categoryFilter={
                categoryFilter
              }
              sortBy={sortBy}
              categories={categories}
              isPending={isPending}
              onSearch={
                handleSearch
              }
              onFilterChange={
                setFilter
              }
              onCategoryFilterChange={
                setCategoryFilter
              }
              onSortChange={
                setSortBy
              }
            />


            {/* STATISTICS */}

            <TaskStats
              totalTasks={
                totalTasks
              }
              activeTasks={
                activeTasks
              }
              completedTasks={
                completedTasks
              }
              progress={
                progress
              }
            />


            {/* PROGRESS */}

            <ProgressBar
              progress={
                progress
              }
            />


            {/* TASK LIST */}

            <TaskList
              tasks={
                displayTasks
              }
              taskListRef={
                taskListRef
              }
              completedTasks={
                completedTasks
              }
              onToggle={
                handleToggle
              }
              onEdit={
                handleEdit
              }
              onDelete={
                handleDelete
              }
              onClearCompleted={
                clearCompleted
              }
            />

          </main>
        )}

      </div>


      {/* COMPLETION NOTIFICATION */}

      {completedTask && (
        <div className="completion-notification">

          <strong>
            ✓ {t("taskCompleted")}
          </strong>

          <span>
            {completedTask.text}
          </span>

        </div>
      )}

    </div>
  );
}

export default TodoApp;