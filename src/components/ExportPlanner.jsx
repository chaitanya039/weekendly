import { toPng } from "html-to-image";

const ExportPlanner = ({ targetId }) => {
  const handleExport = async () => {
    const node = document.getElementById(targetId);
    if (!node) return;

    try {
      const dataUrl = await toPng(node, { cacheBust: true, quality: 1 });

      // download as PNG
      const link = document.createElement("a");
      link.download = "weekend-plan.png";
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <button
        onClick={handleExport}
        className="px-6 py-2 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg hover:opacity-90 transition"
      >
        📤 Export Weekend Plan
      </button>
    </div>
  );
}

export default ExportPlanner;