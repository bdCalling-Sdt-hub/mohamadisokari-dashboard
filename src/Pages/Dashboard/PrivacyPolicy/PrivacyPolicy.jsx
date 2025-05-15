import JoditEditor from "jodit-react";
import React, { useMemo, useRef, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAddPrivacyPolicyMutation, useGetAllCmsQuery } from "../../../features/cms/cmsApi";

function PrivacyPolicy() {
  const editor = useRef(null);
  const [content, setContent] = useState("");

  const config = useMemo(
    () => ({
      theme: "default",
      showCharsCounter: false,
      showWordsCounter: false,
      toolbarAdaptive: true,
      toolbarSticky: false,
      enableDragAndDropFileToEditor: false,
      allowResizeX: false,
      allowResizeY: false,
      statusbar: false,
      buttons: [
        "source",
        "|",
        "bold",
        "italic",
        "underline",
        "|",
        "ul",
        "ol",
        "|",
        "font",
        "fontsize",
        "brush",
        "paragraph",
        "|",
        "image",
        "table",
        "link",
        "|",
        "left",
        "center",
        "right",
        "justify",
        "|",
        "undo",
        "redo",
        "|",
        "hr",
        "eraser",
        "fullsize",
      ],
      useSearch: false,
      spellcheck: false,
      iframe: false,
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      toolbarButtonSize: "small",
      readonly: false,
      observer: { timeout: 100 },
    }),
    []
  );

  const { data, isLoading: loadingAllCms , refetch} = useGetAllCmsQuery(); 
  const [AddPrivacyPolicy, { isLoading }] = useAddPrivacyPolicyMutation();

  // Set initial content when data is loaded
  useEffect(() => {
    if (data?.data?.privacyPolicy) {
      setContent(data.data.privacyPolicy);
    } else {
      // Fallback content if no terms exist yet
      setContent("Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium totam voluptates blanditiis dicta facilis...");
    }
  }, [data]);

  const handleSave = async () => {
    try {
      const result = await AddPrivacyPolicy(content).unwrap();
      refetch();
      toast.success(result?.message);
      console.log(result);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to save content");
      console.error("Error saving content:", error);
    }
  };

  return (
    <>
      <div className="w-full">
        <h1 className="text-[20px] font-medium py-5">Privacy Policy</h1>
        <div className="w-5/5 bg-black">
          {!loadingAllCms && (
            <JoditEditor
              className="my-5 bg-red-300"
              ref={editor}
              value={content}
              onChange={(newContent) => setContent(newContent)}
              config={config}
            />
          )}
        </div>
        <div className="flex items-center justify-end">
          <button
            className={`bg-smart text-[16px] text-white px-10 py-2.5 mt-5 rounded-md ${isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </span>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </>
  );
}

export default React.memo(PrivacyPolicy);