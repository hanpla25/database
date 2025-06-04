"use client";

import { TextData } from "@/app/lib/definition";
import { createClient } from "@/app/utils/supabase/client";
import React, { useState } from "react";

type ListProps = {
  data: TextData[] | null;
};

export default function List({ data }: ListProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleDownloadClick = async (list: TextData, filename: string) => {
    const path = `${list.user_id}/${filename}`;
    await downloadFileClient(path, filename);
  };

  async function downloadFileClient(path: string, filename: string) {
    const supabase = createClient();

    const { data, error } = await supabase.storage
      .from("attachments")
      .download(path);

    if (error || !data) {
      console.error("다운로드 오류:", error?.message);
      alert("파일 다운로드에 실패했습니다.");
      return;
    }

    const blobUrl = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(blobUrl);
  }

  if (!data || data.length === 0) {
    return (
      <>
        <div className="flex items-center justify-center min-h-screen text-gray-500 text-center text-lg">
          원하는 데이터를 저장해보세요
        </div>
      </>
    );
  }

  return (
    <div className="mt-5 mx-4 xl:mx-[auto] max-w-[1258px] space-y-5">
      {data.map((list, index) => (
        <div
          key={list.id || index}
          className="relative flex flex-col bg-white rounded-[30px] shadow-md p-4"
        >
          <div className="flex min-h-24">
            <div className="flex-1 mr-4">
              <p className="break-all text-sm">{list.text}</p>
            </div>
            <div className="flex flex-col items-end justify-between shrink-0 text-right">
              {(list.attachments?.length ?? 0) > 0 && (
                <button
                  className="text-sm text-blue-500 hover:underline self-end"
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                >
                  첨부파일
                </button>
              )}
              <span className="text-xs text-gray-400">
                {new Date(list.created_at).toLocaleString()}
              </span>
            </div>
          </div>

          {/* 모달창 */}
          {openIndex === index && (list.attachments?.length ?? 0) > 0 && (
            <div className="absolute top-full right-4 mt-2 w-60 bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-10">
              <p className="text-sm font-semibold mb-2">첨부파일 목록</p>
              <ul className="text-sm text-blue-600 space-y-1">
                {(list.attachments ?? []).map((url, idx) => {
                  const filename = decodeURIComponent(
                    url.split("/").pop() || ""
                  );
                  return (
                    <li key={idx}>
                      <button
                        onClick={() => handleDownloadClick(list, filename)}
                        className="hover:underline text-blue-600"
                      >
                        {filename}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
