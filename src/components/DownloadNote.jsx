import { FaDownload } from 'react-icons/fa';

const DownloadNote = ({ title, description, labels, reminderAt }) => {

  const downloadNote = () => {
    const noteContent = `Title: ${title}\n\nDescription: ${description}\n\nLabels: ${labels.join(', ')}\n\nReminder: ${reminderAt ? new Date(reminderAt).toLocaleString() : "Not set"}`;
    const blob = new Blob([noteContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title || "note"}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <FaDownload
      className="cursor-pointer hover:text-black"
      onClick={downloadNote}
      title="Download Note"
    />
  );
};

export default DownloadNote;
