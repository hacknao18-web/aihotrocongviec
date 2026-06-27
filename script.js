const STORAGE_KEY = "lecturerTaskAssistant.tasks.v1";

const sampleTasks = [
  {
    id: createId(),
    title: "Soạn bài giảng chuyên đề chuyển đổi số",
    description: "Hoàn thiện slide, ví dụ minh họa và câu hỏi thảo luận cho tiết dạy tuần này.",
    type: "giảng dạy",
    priority: "cao",
    deadline: getDateOffset(1),
    status: "đang làm"
  },
  {
    id: createId(),
    title: "Chấm bài kiểm tra giữa kỳ lớp K12",
    description: "Nhập điểm, ghi nhận xét và tổng hợp các lỗi sinh viên thường gặp.",
    type: "giảng dạy",
    priority: "cao",
    deadline: getDateOffset(-1),
    status: "chưa làm"
  },
  {
    id: createId(),
    title: "Viết báo cáo tiến độ đề tài cấp khoa",
    description: "Cập nhật kết quả khảo sát, bảng minh chứng và kế hoạch tháng tiếp theo.",
    type: "nghiên cứu",
    priority: "trung bình",
    deadline: getDateOffset(4),
    status: "đang làm"
  },
  {
    id: createId(),
    title: "Nộp hồ sơ chuyên môn học kỳ",
    description: "Rà soát giáo án, lịch trình giảng dạy, đề cương và minh chứng theo yêu cầu.",
    type: "hành chính",
    priority: "cao",
    deadline: getDateOffset(2),
    status: "chưa làm"
  },
  {
    id: createId(),
    title: "Đọc tài liệu về AI trong giáo dục",
    description: "Ghi chú các ý có thể đưa vào bài giảng và đề xuất ứng dụng nhỏ cho lớp học.",
    type: "cá nhân",
    priority: "thấp",
    deadline: getDateOffset(8),
    status: "hoàn thành"
  }
];

let tasks = loadTasks();

const elements = {
  taskList: document.getElementById("taskList"),
  taskTemplate: document.getElementById("taskTemplate"),
  taskForm: document.getElementById("taskForm"),
  taskId: document.getElementById("taskId"),
  titleInput: document.getElementById("titleInput"),
  descriptionInput: document.getElementById("descriptionInput"),
  typeInput: document.getElementById("typeInput"),
  priorityInput: document.getElementById("priorityInput"),
  deadlineInput: document.getElementById("deadlineInput"),
  statusInput: document.getElementById("statusInput"),
  submitLabel: document.getElementById("submitLabel"),
  cancelEditBtn: document.getElementById("cancelEditBtn"),
  quickAddBtn: document.getElementById("quickAddBtn"),
  resetSampleBtn: document.getElementById("resetSampleBtn"),
  refreshAiBtn: document.getElementById("refreshAiBtn"),
  searchInput: document.getElementById("searchInput"),
  typeFilter: document.getElementById("typeFilter"),
  statusFilter: document.getElementById("statusFilter"),
  priorityFilter: document.getElementById("priorityFilter"),
  totalTasks: document.getElementById("totalTasks"),
  doneTasks: document.getElementById("doneTasks"),
  doingTasks: document.getElementById("doingTasks"),
  overdueTasks: document.getElementById("overdueTasks"),
  completionPercent: document.getElementById("completionPercent"),
  aiSuggestions: document.getElementById("aiSuggestions"),
  deadlineList: document.getElementById("deadlineList"),
  statusChart: document.getElementById("statusChart"),
  typeChart: document.getElementById("typeChart")
};

document.addEventListener("DOMContentLoaded", () => {
  bindEvents();
  setDefaultDeadline();
  renderApp();
  registerPwa();
});

function bindEvents() {
  elements.taskForm.addEventListener("submit", handleFormSubmit);
  elements.cancelEditBtn.addEventListener("click", resetForm);
  elements.quickAddBtn.addEventListener("click", () => elements.titleInput.focus());
  elements.resetSampleBtn.addEventListener("click", resetSampleData);
  elements.refreshAiBtn.addEventListener("click", renderAiSuggestions);

  [elements.searchInput, elements.typeFilter, elements.statusFilter, elements.priorityFilter].forEach((input) => {
    input.addEventListener("input", renderTaskList);
  });
}

function loadTasks() {
  // Dữ liệu được giữ trong trình duyệt để phiên bản đầu không cần backend.
  const savedTasks = localStorage.getItem(STORAGE_KEY);

  if (!savedTasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleTasks));
    return sampleTasks;
  }

  try {
    return JSON.parse(savedTasks);
  } catch (error) {
    console.warn("Không đọc được dữ liệu đã lưu, khởi tạo lại dữ liệu mẫu.", error);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleTasks));
    return sampleTasks;
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function handleFormSubmit(event) {
  event.preventDefault();

  const taskData = {
    title: elements.titleInput.value.trim(),
    description: elements.descriptionInput.value.trim(),
    type: elements.typeInput.value,
    priority: elements.priorityInput.value,
    deadline: elements.deadlineInput.value,
    status: elements.statusInput.value
  };

  if (!taskData.title || !taskData.deadline) {
    return;
  }

  if (elements.taskId.value) {
    tasks = tasks.map((task) => (
      task.id === elements.taskId.value ? { ...task, ...taskData } : task
    ));
  } else {
    tasks.unshift({
      id: createId(),
      ...taskData
    });
  }

  saveTasks();
  resetForm();
  renderApp();
}

function editTask(taskId) {
  const task = tasks.find((item) => item.id === taskId);
  if (!task) return;

  elements.taskId.value = task.id;
  elements.titleInput.value = task.title;
  elements.descriptionInput.value = task.description;
  elements.typeInput.value = task.type;
  elements.priorityInput.value = task.priority;
  elements.deadlineInput.value = task.deadline;
  elements.statusInput.value = task.status;
  elements.submitLabel.textContent = "Cập nhật";
  elements.titleInput.focus();
}

function deleteTask(taskId) {
  const task = tasks.find((item) => item.id === taskId);
  if (!task) return;

  const agreed = window.confirm(`Xóa công việc "${task.title}"?`);
  if (!agreed) return;

  tasks = tasks.filter((item) => item.id !== taskId);
  saveTasks();
  renderApp();
}

function completeTask(taskId) {
  tasks = tasks.map((task) => (
    task.id === taskId ? { ...task, status: "hoàn thành" } : task
  ));
  saveTasks();
  renderApp();
}

function resetForm() {
  elements.taskForm.reset();
  elements.taskId.value = "";
  elements.priorityInput.value = "trung bình";
  elements.statusInput.value = "chưa làm";
  elements.submitLabel.textContent = "Lưu công việc";
  setDefaultDeadline();
}

function resetSampleData() {
  const agreed = window.confirm("Khôi phục dữ liệu mẫu? Dữ liệu hiện tại sẽ được thay thế.");
  if (!agreed) return;

  tasks = sampleTasks.map((task) => ({ ...task, id: createId() }));
  saveTasks();
  resetForm();
  renderApp();
}

function renderApp() {
  renderDashboard();
  renderTaskList();
  renderAiSuggestions();
  renderDeadlineList();
  renderCharts();
}

function renderDashboard() {
  const total = tasks.length;
  const done = tasks.filter((task) => task.status === "hoàn thành").length;
  const doing = tasks.filter((task) => task.status === "đang làm").length;
  const overdue = tasks.filter(isOverdue).length;
  const completion = total ? Math.round((done / total) * 100) : 0;

  elements.totalTasks.textContent = total;
  elements.doneTasks.textContent = done;
  elements.doingTasks.textContent = doing;
  elements.overdueTasks.textContent = overdue;
  elements.completionPercent.textContent = `${completion}%`;
  elements.completionPercent.parentElement.style.setProperty("--progress", `${completion}%`);
}

function renderTaskList() {
  elements.taskList.innerHTML = "";

  const filteredTasks = getFilteredTasks().sort(sortBySmartPriority);

  if (!filteredTasks.length) {
    elements.taskList.innerHTML = `<div class="empty-state">Không có công việc phù hợp với bộ lọc hiện tại.</div>`;
    return;
  }

  filteredTasks.forEach((task) => {
    const node = elements.taskTemplate.content.firstElementChild.cloneNode(true);
    const deadlineInfo = getDeadlineInfo(task);

    node.classList.toggle("overdue", isOverdue(task));
    node.classList.toggle("high-priority", task.priority === "cao");
    node.querySelector("h3").textContent = task.title;
    node.querySelector(".task-description").textContent = task.description || "Chưa có mô tả chi tiết.";

    const priorityBadge = node.querySelector(".priority-badge");
    priorityBadge.textContent = `Ưu tiên ${task.priority}`;
    priorityBadge.classList.add(`priority-${slugify(task.priority)}`);

    node.querySelector(".task-meta").innerHTML = `
      <span class="tag">${capitalize(task.type)}</span>
      <span class="tag ${task.status === "hoàn thành" ? "success" : ""}">${capitalize(task.status)}</span>
      <span class="tag ${deadlineInfo.className}">${deadlineInfo.label}</span>
    `;

    node.querySelector(".edit-task").addEventListener("click", () => editTask(task.id));
    node.querySelector(".delete-task").addEventListener("click", () => deleteTask(task.id));
    node.querySelector(".complete-task").addEventListener("click", () => completeTask(task.id));
    node.querySelector(".complete-task").disabled = task.status === "hoàn thành";

    elements.taskList.appendChild(node);
  });
}

function renderAiSuggestions() {
  const suggestions = buildAiSuggestions();
  elements.aiSuggestions.innerHTML = suggestions.map((item) => `
    <article class="suggestion-item ${item.level}">
      <strong>${item.title}</strong>
      <p>${item.message}</p>
    </article>
  `).join("");
}

function buildAiSuggestions() {
  // AI mô phỏng bằng quy tắc: ưu tiên việc quan trọng, gần hạn và chưa hoàn thành.
  const activeTasks = tasks.filter((task) => task.status !== "hoàn thành").sort(sortBySmartPriority);
  const overdueTasks = activeTasks.filter(isOverdue);
  const soonTasks = activeTasks.filter((task) => {
    const days = getDaysUntilDeadline(task.deadline);
    return days >= 0 && days <= 3;
  });
  const highPriority = activeTasks.filter((task) => task.priority === "cao");
  const topTask = activeTasks[0];
  const suggestions = [];

  if (overdueTasks.length) {
    suggestions.push({
      level: "danger",
      title: "Cần xử lý ngay",
      message: `${overdueTasks.length} công việc đã quá hạn. Nên bắt đầu với "${overdueTasks[0].title}" và đặt mốc hoàn tất trong hôm nay.`
    });
  }

  if (topTask) {
    suggestions.push({
      level: topTask.priority === "cao" ? "warning" : "",
      title: "Ưu tiên làm trước",
      message: `"${topTask.title}" đang có điểm ưu tiên cao nhất vì mức độ quan trọng và hạn chót gần.`
    });

    suggestions.push({
      level: "",
      title: "Chia nhỏ công việc",
      message: `Với "${topTask.title}", hãy tách thành 3 bước: chuẩn bị tài liệu, xử lý phần chính, rà soát và nộp/kết thúc.`
    });
  }

  if (soonTasks.length) {
    suggestions.push({
      level: "warning",
      title: "Cảnh báo deadline",
      message: `${soonTasks.length} công việc sẽ đến hạn trong 3 ngày tới. Nên dành phiên làm việc tập trung 60-90 phút cho nhóm này.`
    });
  }

  if (highPriority.length) {
    suggestions.push({
      level: "warning",
      title: "Kế hoạch trong ngày",
      message: `Buổi sáng xử lý việc ưu tiên cao, buổi chiều hoàn thiện hồ sơ/minh chứng, cuối ngày cập nhật trạng thái để dashboard phản ánh đúng tiến độ.`
    });
  }

  suggestions.push({
    level: "",
    title: "Kế hoạch theo tuần",
    message: "Đầu tuần chọn 3 việc quan trọng nhất, giữa tuần kiểm tra tiến độ, cuối tuần tổng hợp việc hoàn thành và chuyển việc tồn sang tuần sau."
  });

  if (!activeTasks.length) {
    return [{
      level: "",
      title: "Tất cả đã hoàn thành",
      message: "Bạn có thể thêm công việc mới hoặc khôi phục dữ liệu mẫu để tiếp tục thử nghiệm hệ thống."
    }];
  }

  return suggestions.slice(0, 5);
}

function renderDeadlineList() {
  const urgentTasks = tasks
    .filter((task) => task.status !== "hoàn thành")
    .filter((task) => getDaysUntilDeadline(task.deadline) <= 5)
    .sort(sortBySmartPriority);

  if (!urgentTasks.length) {
    elements.deadlineList.innerHTML = `<div class="empty-state">Không có công việc nào đến hạn trong 5 ngày tới.</div>`;
    return;
  }

  elements.deadlineList.innerHTML = urgentTasks.map((task) => {
    const deadlineInfo = getDeadlineInfo(task);
    const level = isOverdue(task) ? "danger" : "";
    return `
      <article class="deadline-item ${level}">
        <strong>${task.title}</strong>
        <p>${deadlineInfo.label} · Ưu tiên ${task.priority} · ${capitalize(task.type)}</p>
      </article>
    `;
  }).join("");
}

function renderCharts() {
  renderBarChart(elements.statusChart, countBy(["chưa làm", "đang làm", "hoàn thành"], "status"), tasks.length);
  renderBarChart(elements.typeChart, countBy(["giảng dạy", "nghiên cứu", "hành chính", "cá nhân"], "type"), tasks.length);
}

function renderBarChart(container, data, total) {
  container.innerHTML = data.map((item) => {
    const width = total ? Math.round((item.value / total) * 100) : 0;
    return `
      <div class="chart-row">
        <span>${capitalize(item.label)}</span>
        <div class="chart-track">
          <div class="chart-fill" style="--width: ${width}%"></div>
        </div>
        <strong>${item.value}</strong>
      </div>
    `;
  }).join("");
}

function getFilteredTasks() {
  const keyword = normalizeText(elements.searchInput.value);

  return tasks.filter((task) => {
    const matchesKeyword = normalizeText(task.title).includes(keyword);
    const matchesType = elements.typeFilter.value === "all" || task.type === elements.typeFilter.value;
    const matchesStatus = elements.statusFilter.value === "all" || task.status === elements.statusFilter.value;
    const matchesPriority = elements.priorityFilter.value === "all" || task.priority === elements.priorityFilter.value;

    return matchesKeyword && matchesType && matchesStatus && matchesPriority;
  });
}

function sortBySmartPriority(a, b) {
  return getPriorityScore(b) - getPriorityScore(a);
}

function getPriorityScore(task) {
  // Điểm càng cao thì công việc càng nên được đưa lên đầu danh sách.
  const priorityScore = { cao: 60, "trung bình": 35, thấp: 15 }[task.priority] || 0;
  const statusScore = { "chưa làm": 20, "đang làm": 12, "hoàn thành": -100 }[task.status] || 0;
  const days = getDaysUntilDeadline(task.deadline);
  const deadlineScore = days < 0 ? 50 : Math.max(0, 30 - days * 5);

  return priorityScore + statusScore + deadlineScore;
}

function getDeadlineInfo(task) {
  const days = getDaysUntilDeadline(task.deadline);
  const formattedDate = formatDate(task.deadline);

  if (task.status === "hoàn thành") {
    return { label: `Đã hoàn thành · hạn ${formattedDate}`, className: "success" };
  }

  if (days < 0) {
    return { label: `Quá hạn ${Math.abs(days)} ngày · ${formattedDate}`, className: "danger" };
  }

  if (days === 0) {
    return { label: `Hạn hôm nay · ${formattedDate}`, className: "danger" };
  }

  if (days <= 3) {
    return { label: `Còn ${days} ngày · ${formattedDate}`, className: "danger" };
  }

  return { label: `Hạn ${formattedDate}`, className: "" };
}

function isOverdue(task) {
  return task.status !== "hoàn thành" && getDaysUntilDeadline(task.deadline) < 0;
}

function getDaysUntilDeadline(dateValue) {
  const today = new Date();
  const deadline = new Date(`${dateValue}T00:00:00`);
  today.setHours(0, 0, 0, 0);
  deadline.setHours(0, 0, 0, 0);

  return Math.round((deadline - today) / 86400000);
}

function getDateOffset(offset) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return formatInputDate(date);
}

function setDefaultDeadline() {
  elements.deadlineInput.value = getDateOffset(3);
}

function countBy(labels, key) {
  return labels.map((label) => ({
    label,
    value: tasks.filter((task) => task[key] === label).length
  }));
}

function formatDate(dateValue) {
  return new Intl.DateTimeFormat("vi-VN").format(new Date(`${dateValue}T00:00:00`));
}

function normalizeText(value) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function createId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  return `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatInputDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function slugify(value) {
  return normalizeText(value).replace(/\s+/g, "-");
}

function registerPwa() {
  // Service worker chỉ hoạt động khi app được mở qua localhost hoặc HTTPS.
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch((error) => {
      console.warn("Chưa thể đăng ký PWA service worker.", error);
    });
  });
}
