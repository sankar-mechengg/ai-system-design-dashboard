import { useState, useMemo, useCallback } from "react";
import {
  components,
  layers,
  type SystemComponent,
  type Criticality,
} from "../data/architecture";
import {
  Shield,
  Globe,
  Server,
  Database,
  Brain,
  GitBranch,
  Monitor,
  Smartphone,
  Cloud,
  Lock,
  Zap,
  Network,
  Search,
  Bell,
  CreditCard,
  BarChart3,
  FileText,
  HardDrive,
  Key,
  RefreshCw,
  Bot,
  Layers,
  Route,
  Gauge,
  Blocks,
  MessageSquare,
  ListTodo,
  X,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Info,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  frontend: Globe,
  mobile: Smartphone,
  dns: Network,
  cdn: Cloud,
  waf: Shield,
  ddos: Shield,
  loadbalancer: Gauge,
  apigateway: Route,
  auth: Lock,
  ratelimiter: Zap,
  appserver: Server,
  websocket: MessageSquare,
  messagequeue: Blocks,
  taskqueue: ListTodo,
  notifications: Bell,
  llm: Brain,
  llmorchestrator: Bot,
  vectordb: Database,
  rag: Layers,
  embedding: Brain,
  promptmgmt: FileText,
  primarydb: Database,
  nosqldb: Database,
  cache: Zap,
  objectstorage: HardDrive,
  search: Search,
  container: Blocks,
  autoscaling: RefreshCw,
  vpc: Network,
  secrets: Key,
  cicd: GitBranch,
  monitoring: Monitor,
  errortracking: Monitor,
  logging: FileText,
  ssl: Lock,
  encryption: Lock,
  backup: RefreshCw,
  billing: CreditCard,
  analytics: BarChart3,
};

const criticalityConfig: Record<
  Criticality,
  { label: string; color: string; bgClass: string; borderClass: string; badgeClass: string }
> = {
  absolute: {
    label: "Absolute",
    color: "#ef4444",
    bgClass: "bg-red-500/10",
    borderClass: "border-red-500/30",
    badgeClass: "bg-red-500/20 text-red-400 border-red-500/30",
  },
  conditional: {
    label: "Conditional",
    color: "#f59e0b",
    bgClass: "bg-amber-500/10",
    borderClass: "border-amber-500/30",
    badgeClass: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
  optional: {
    label: "Optional",
    color: "#6366f1",
    bgClass: "bg-indigo-500/10",
    borderClass: "border-indigo-500/30",
    badgeClass: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  },
};

const layerColorMap: Record<string, string> = {
  user: "#3b82f6",
  edge: "#06b6d4",
  gateway: "#8b5cf6",
  backend: "#10b981",
  ai: "#f59e0b",
  data: "#ef4444",
  infra: "#6366f1",
  devops: "#ec4899",
};

function CriticalityBadge({ criticality }: { criticality: Criticality }) {
  const config = criticalityConfig[criticality];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${config.badgeClass}`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: config.color }}
      />
      {config.label}
    </span>
  );
}

// The interactive flow diagram
function FlowDiagram({
  onNodeClick,
  selectedId,
  filterCriticality,
}: {
  onNodeClick: (id: string) => void;
  selectedId: string | null;
  filterCriticality: Criticality | "all";
}) {
  const filteredComponents = useMemo(
    () =>
      filterCriticality === "all"
        ? components
        : components.filter((c) => c.criticality === filterCriticality),
    [filterCriticality]
  );

  const groupedByLayer = useMemo(() => {
    const map = new Map<string, SystemComponent[]>();
    for (const l of layers) {
      map.set(
        l.id,
        filteredComponents.filter((c) => c.layer === l.id)
      );
    }
    return map;
  }, [filteredComponents]);

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[900px] p-4 space-y-2">
        {layers.map((layer) => {
          const layerComponents = groupedByLayer.get(layer.id) || [];
          if (layerComponents.length === 0) return null;
          return (
            <div key={layer.id} className="relative">
              <div
                className="rounded-lg border p-3"
                style={{
                  borderColor: `${layer.color}25`,
                  background: `linear-gradient(135deg, ${layer.color}06, ${layer.color}03)`,
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: layer.color }}
                  />
                  <span
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: layer.color }}
                  >
                    {layer.label}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">
                    — {layer.description}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {layerComponents.map((comp) => {
                    const Icon = iconMap[comp.id] || Server;
                    const isSelected = selectedId === comp.id;
                    const critConfig = criticalityConfig[comp.criticality];
                    return (
                      <button
                        key={comp.id}
                        data-testid={`node-${comp.id}`}
                        onClick={() => onNodeClick(comp.id)}
                        className={`group relative flex items-center gap-2 px-3 py-2 rounded-md border text-sm transition-all duration-200 hover:scale-[1.02] ${
                          isSelected
                            ? "ring-2 ring-primary shadow-md"
                            : "hover:shadow-sm"
                        }`}
                        style={{
                          borderColor: isSelected
                            ? undefined
                            : `${critConfig.color}40`,
                          backgroundColor: isSelected
                            ? `${layer.color}15`
                            : `${layer.color}08`,
                        }}
                      >
                        <Icon
                          size={14}
                          style={{ color: layer.color }}
                          className="shrink-0"
                        />
                        <span className="font-medium text-foreground whitespace-nowrap text-xs">
                          {comp.shortName}
                        </span>
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{
                            backgroundColor: critConfig.color,
                          }}
                          title={critConfig.label}
                        />
                        {/* Hover tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 pointer-events-none">
                          <div className="bg-popover border border-popover-border rounded-lg shadow-xl p-3 max-w-xs text-left">
                            <div className="font-semibold text-sm text-foreground mb-1">
                              {comp.name}
                            </div>
                            <CriticalityBadge
                              criticality={comp.criticality}
                            />
                            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                              {comp.criticalityReason}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* Arrow to next layer */}
              {layer.id !== "devops" &&
                layerComponents.length > 0 && (
                  <div className="flex justify-center py-1">
                    <svg width="20" height="16" viewBox="0 0 20 16">
                      <path
                        d="M10 0 L10 10 M5 6 L10 12 L15 6"
                        stroke="hsl(var(--muted-foreground) / 0.3)"
                        strokeWidth="1.5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Detail panel for a selected component
function DetailPanel({
  component,
  onClose,
}: {
  component: SystemComponent;
  onClose: () => void;
}) {
  const [expandedVendor, setExpandedVendor] = useState<number | null>(null);
  const Icon = iconMap[component.id] || Server;
  const layerColor = layerColorMap[component.layer];
  const critConfig = criticalityConfig[component.criticality];

  return (
    <div className="bg-card border border-card-border rounded-lg overflow-hidden">
      {/* Header */}
      <div
        className="p-4 border-b"
        style={{
          borderBottomColor: `${layerColor}30`,
          background: `linear-gradient(135deg, ${layerColor}10, transparent)`,
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${layerColor}15` }}
            >
              <Icon size={20} style={{ color: layerColor }} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                {component.name}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <CriticalityBadge criticality={component.criticality} />
                <span
                  className="text-xs px-2 py-0.5 rounded-full border"
                  style={{
                    borderColor: `${layerColor}30`,
                    color: layerColor,
                    backgroundColor: `${layerColor}10`,
                  }}
                >
                  {layers.find((l) => l.id === component.layer)?.label}
                </span>
              </div>
            </div>
          </div>
          <button
            data-testid="button-close-detail"
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-muted transition-colors"
          >
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Criticality reasoning */}
      <div
        className={`mx-4 mt-4 p-3 rounded-lg border ${critConfig.bgClass} ${critConfig.borderClass}`}
      >
        <div className="flex items-start gap-2">
          <Info size={14} style={{ color: critConfig.color }} className="mt-0.5 shrink-0" />
          <div>
            <span
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: critConfig.color }}
            >
              Why {critConfig.label}?
            </span>
            <p className="text-xs text-foreground/80 mt-1 leading-relaxed">
              {component.criticalityReason}
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="px-4 pt-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
          What it does
        </h3>
        <p className="text-sm text-foreground/80 leading-relaxed">
          {component.description}
        </p>
      </div>

      {/* Function summary */}
      <div className="px-4 pt-3">
        <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg">
          <Zap size={12} className="text-muted-foreground shrink-0" />
          <span className="text-xs text-muted-foreground font-medium">
            {component.function}
          </span>
        </div>
      </div>

      {/* Vendor Options */}
      <div className="px-4 pt-4 pb-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Vendor Options
        </h3>
        <div className="space-y-1.5">
          {component.vendors.map((vendor, idx) => (
            <div
              key={idx}
              className={`rounded-lg border transition-all duration-200 ${
                vendor.recommended
                  ? "border-primary/30 bg-primary/5"
                  : "border-border/50 hover:border-border"
              }`}
            >
              <button
                data-testid={`vendor-${component.id}-${idx}`}
                onClick={() =>
                  setExpandedVendor(expandedVendor === idx ? null : idx)
                }
                className="w-full p-3 text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    {vendor.recommended && (
                      <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 uppercase">
                        Pick
                      </span>
                    )}
                    <span className="text-sm font-medium text-foreground leading-tight">
                      {vendor.name}
                    </span>
                  </div>
                  {expandedVendor === idx ? (
                    <ChevronDown size={14} className="text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronRight size={14} className="text-muted-foreground shrink-0" />
                  )}
                </div>
                <div className="mt-1 ml-0">
                  <span className="text-xs text-muted-foreground font-mono">
                    {vendor.pricing}
                  </span>
                </div>
              </button>
              {expandedVendor === idx && (
                <div className="px-3 pb-3 -mt-1">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {vendor.description}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Request flow visualization
function RequestFlowSection() {
  const steps = [
    { step: 1, label: "User hits URL", detail: "Browser initiates DNS lookup", icon: Globe, color: "#3b82f6" },
    { step: 2, label: "DNS Resolves", detail: "Route53 / Cloudflare returns IP", icon: Network, color: "#06b6d4" },
    { step: 3, label: "CDN Serves Frontend", detail: "Static assets served from nearest edge PoP", icon: Cloud, color: "#06b6d4" },
    { step: 4, label: "WAF + DDoS Check", detail: "Malicious requests blocked at edge", icon: Shield, color: "#06b6d4" },
    { step: 5, label: "Load Balancer", detail: "Routes to healthiest backend instance", icon: Gauge, color: "#8b5cf6" },
    { step: 6, label: "API Gateway", detail: "JWT verified, rate limits checked, request routed", icon: Route, color: "#8b5cf6" },
    { step: 7, label: "App Server", detail: "Business logic: fetch user, check subscription tier", icon: Server, color: "#10b981" },
    { step: 8, label: "Cache Check", detail: "Redis checks if response is cached", icon: Zap, color: "#ef4444" },
    { step: 9, label: "DB Query", detail: "Fetch user history, lesson context from Postgres", icon: Database, color: "#ef4444" },
    { step: 10, label: "Vector DB (RAG)", detail: "Retrieve relevant course content via embeddings", icon: Layers, color: "#f59e0b" },
    { step: 11, label: "LLM Inference", detail: "Send augmented prompt to GPT-4o / Claude", icon: Brain, color: "#f59e0b" },
    { step: 12, label: "Stream Response", detail: "Tokens streamed back via WebSocket/SSE", icon: MessageSquare, color: "#10b981" },
  ];

  return (
    <div className="bg-card border border-card-border rounded-lg p-4">
      <h2 className="text-base font-semibold text-foreground mb-1">
        Request Lifecycle — The Happy Path
      </h2>
      <p className="text-xs text-muted-foreground mb-4">
        What happens from the moment a user types a question to when they see the
        AI response streaming on screen.
      </p>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[19px] top-3 bottom-3 w-px bg-border" />
        <div className="space-y-1">
          {steps.map((s, i) => (
            <div key={i} className="flex items-start gap-3 relative group">
              <div
                className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-transform duration-200 group-hover:scale-110"
                style={{
                  borderColor: s.color,
                  backgroundColor: `${s.color}15`,
                }}
              >
                <s.icon size={16} style={{ color: s.color }} />
              </div>
              <div className="pt-1.5 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground">
                    {String(s.step).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {s.label}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {s.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Stats overview
function StatsOverview() {
  const absoluteCount = components.filter(
    (c) => c.criticality === "absolute"
  ).length;
  const conditionalCount = components.filter(
    (c) => c.criticality === "conditional"
  ).length;
  const optionalCount = components.filter(
    (c) => c.criticality === "optional"
  ).length;

  return (
    <div className="grid grid-cols-4 gap-3">
      <div className="bg-card border border-card-border rounded-lg p-3">
        <div className="text-2xl font-bold text-foreground font-mono">
          {components.length}
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">
          Total Components
        </div>
      </div>
      <div className="bg-card border border-card-border rounded-lg p-3">
        <div className="text-2xl font-bold text-red-400 font-mono">
          {absoluteCount}
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">Absolute</div>
      </div>
      <div className="bg-card border border-card-border rounded-lg p-3">
        <div className="text-2xl font-bold text-amber-400 font-mono">
          {conditionalCount}
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">Conditional</div>
      </div>
      <div className="bg-card border border-card-border rounded-lg p-3">
        <div className="text-2xl font-bold text-indigo-400 font-mono">
          {optionalCount}
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">Optional</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterCriticality, setFilterCriticality] = useState<
    Criticality | "all"
  >("all");
  const [activeTab, setActiveTab] = useState<"architecture" | "flow">(
    "architecture"
  );
  const [isDark, setIsDark] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : true
  );

  const selectedComponent = useMemo(
    () => components.find((c) => c.id === selectedId) || null,
    [selectedId]
  );

  const handleNodeClick = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  }, []);

  // Set initial dark mode class
  useMemo(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="shrink-0 border-b border-border bg-card/80 backdrop-blur-sm px-4 py-3">
        <div className="flex items-center justify-between max-w-[1600px] mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className="text-primary"
              >
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-foreground">
                System Architecture Dashboard
              </h1>
              <p className="text-xs text-muted-foreground">
                AI Learning Chatbot — Production Infrastructure
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Criticality filter */}
            <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-0.5">
              {(["all", "absolute", "conditional", "optional"] as const).map(
                (f) => (
                  <button
                    key={f}
                    data-testid={`filter-${f}`}
                    onClick={() => setFilterCriticality(f)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                      filterCriticality === f
                        ? "bg-background shadow-sm text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {f === "all"
                      ? "All"
                      : f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                )
              )}
            </div>
            {/* Theme toggle */}
            <button
              data-testid="button-theme-toggle"
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Left: Architecture / Flow */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="max-w-[1100px] mx-auto space-y-4">
            {/* Tabs */}
            <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-0.5 w-fit">
              <button
                data-testid="tab-architecture"
                onClick={() => setActiveTab("architecture")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeTab === "architecture"
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Component Map
              </button>
              <button
                data-testid="tab-flow"
                onClick={() => setActiveTab("flow")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeTab === "flow"
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Request Lifecycle
              </button>
            </div>

            {/* Stats */}
            <StatsOverview />

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="font-medium">Criticality:</span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Absolute — Non-negotiable for production
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Conditional — Required under specific conditions
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                Optional — Nice to have, add as you scale
              </span>
            </div>

            {/* Main content area */}
            {activeTab === "architecture" ? (
              <FlowDiagram
                onNodeClick={handleNodeClick}
                selectedId={selectedId}
                filterCriticality={filterCriticality}
              />
            ) : (
              <RequestFlowSection />
            )}
          </div>
        </div>

        {/* Right: Detail Panel */}
        {selectedComponent && (
          <div className="w-[440px] shrink-0 border-l border-border overflow-y-auto bg-background p-4">
            <DetailPanel
              component={selectedComponent}
              onClose={() => setSelectedId(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
