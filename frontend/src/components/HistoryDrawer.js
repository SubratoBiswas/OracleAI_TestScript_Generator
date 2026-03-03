import React from "react";

export default function HistoryDrawer({ isOpen, onClose, history, onSelect }) {
  return (
    <>
      <div
        className={`overlay ${isOpen ? "visible" : ""}`}
        onClick={onClose}
      ></div>
      <div className={`history-drawer ${isOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <div className="drawer-title">Generation History</div>
          <button className="drawer-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="drawer-body">
          {history.length === 0 ? (
            <div className="history-empty">
              No test scripts generated yet.
              <br />
              Your generation history will appear here.
            </div>
          ) : (
            history.map((item, index) => (
              <div
                key={index}
                className="history-item"
                onClick={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <div className="history-item-module">{item.module}</div>
                <div className="history-item-desc">{item.description}</div>
                <div className="history-item-meta">
                  {item.testType} &middot; {item.timestamp}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
