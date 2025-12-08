import { PerformerCard } from "./PerformerCard";
import { Award, Film, Building2 } from "lucide-react";
import { MOCK_DATA } from "../page";
export const TopPerformersSection = () => (
  <section className="mb-8">
    <h2 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
      🏆 Top Performers
    </h2>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <PerformerCard
        icon={Award}
        title="Nhân viên xuất sắc"
        performers={MOCK_DATA.topPerformers.employees}
        valueLabel="₫"
        iconColor="bg-primary/10 text-primary"
      />
      <PerformerCard
        icon={Film}
        title="Phim hiệu suất tốt"
        performers={MOCK_DATA.topPerformers.movies}
        valueLabel="vé"
        iconColor="bg-purple-100 text-purple-600"
      />
      <PerformerCard
        icon={Building2}
        title="Rạp hiệu quả nhất"
        performers={MOCK_DATA.topPerformers.theaters}
        valueLabel="₫"
        iconColor="bg-green-100 text-green-600"
      />
    </div>
  </section>
);