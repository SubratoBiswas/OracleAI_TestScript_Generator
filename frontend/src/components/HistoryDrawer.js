import React from "react";

export default function HistoryDrawer({ isOpen, onClose, history, onSelect }) {
  return (
    <>
      <div
        className={`overlay ${isOpen ? "visible" : ""}`}
        onClick={onClose}
      />
      <div className={`history-drawer ${isOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <div className="drawer-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Generation History
          </div>
          <button className="drawer-close" onClick={onClose} title="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="drawer-body">
          {history.length === 0 ? (
            <div className="history-empty">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <p>No scripts generated yet.</p>
              <span>Your generation history will appear here.</span>
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
                <div className="history-item-top">
                  <div className="history-item-module">{item.module}</div>
                  <div className="history-item-type">{item.testType}</div>
                </div>
                <div className="history-item-desc">{item.description}</div>
                <div className="history-item-meta">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {item.timestamp}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
