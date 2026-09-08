"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
    Menu,
    Search,
    Grid3X3,
    Terminal,
    Bell,
    CircleHelp,
    Settings,
    ChevronDown,
    ExternalLink,
    Monitor,
    MessageSquare,
    ChevronRight,
    Info
} from "lucide-react";
import { getToken, removeToken } from "@/lib/auth";

function getUserName(): string | null {
    const token = getToken();
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.name || payload.email?.split("@")[0] || payload.sub || "User";
    } catch {
        return null;
    }
}

export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
        if (!getToken()) {
            router.push("/login");
            return;
        }
        setUserName(getUserName());
    }, [router]);

    const handleSignOut = () => {
        removeToken();
        router.push("/login");
    };

    if (!userName) return null; // or a loading spinner

    return (
        <div className="layout-wrapper">
            <style>{`
                /* Global resets for the app */
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f2f3f3; color: #0f1111; }
                a { text-decoration: none; color: #0073bb; }
                a:hover { text-decoration: underline; }

                .layout-wrapper { display: flex; flex-direction: column; min-height: 100vh; }

                /* ── TOP NAV ── */
                .db-nav {
                    height: 40px; background: #161e2d;
                    display: flex; align-items: center;
                    padding: 0 16px; gap: 16px; color: #e6e9ee;
                    position: sticky; top: 0; z-index: 100;
                    font-size: 13px;
                }
                .db-logo {
                    font-size: 22px; font-weight: 700; color: #ff9900;
                    letter-spacing: -1px; line-height: 1; cursor: pointer;
                    display: flex; align-items: center; gap: 8px;
                }
                .db-r53icon {
                    width: 20px; height: 20px; border-radius: 4px;
                    background: linear-gradient(135deg,#4f46e5,#7c3aed);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 10px; color: #fff;
                }
                .db-search {
                    display: flex; align-items: center; gap: 8px;
                    background: #252f3e; border: 1px solid #3a4555; border-radius: 4px;
                    padding: 4px 10px; color: #c8cdd5; font-size: 13px;
                    flex: 1; max-width: 500px; cursor: text;
                }
                .db-search-shortcut { margin-left: auto; font-size: 11px; color: #6b7280; }
                .db-nav-right {
                    margin-left: auto; display: flex; align-items: center; gap: 16px;
                }
                .db-nav-btn {
                    background: none; border: none; color: #c8cdd5;
                    cursor: pointer; display: flex; align-items: center;
                }
                .db-nav-btn:hover { color: #fff; }
                
                .db-account-info {
                    display: flex; align-items: center; gap: 4px;
                    background: #252f3e; padding: 2px 8px; border-radius: 12px;
                    cursor: pointer;
                }
                .db-account-info:hover { background: #3a4555; }
                
                .db-signout-btn {
                    background: none; border: none; color: #c8cdd5; cursor: pointer; font-size: 13px;
                }
                .db-signout-btn:hover { color: #fff; text-decoration: underline; }

                /* ── SECONDARY BAR ── */
                .db-secondary {
                    height: 36px; background: #fff;
                    display: flex; align-items: center; padding: 0 16px;
                    border-bottom: 1px solid #d5d9d9; color: #0073bb; font-size: 14px; gap: 8px;
                }
                .db-secondary-btn {
                    background: none; border: none; color: #0073bb; cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    width: 24px; height: 24px; border-radius: 50%;
                }
                .db-secondary-btn:hover { background: #f2f8fd; }
                
                .db-breadcrumb { display: flex; align-items: center; gap: 8px; color: #555; font-size: 13px; }
                .db-breadcrumb span { display: flex; align-items: center; gap: 4px; }
                .db-breadcrumb-current { font-weight: 700; color: #0f1111; }

                /* ── MAIN LAYOUT ── */
                .db-main { display: flex; flex: 1; }

                /* ── SIDEBAR ── */
                .db-sidebar {
                    width: 240px; background: #fff; border-right: 1px solid #d5d9d9;
                    display: flex; flex-direction: column; flex-shrink: 0;
                    height: calc(100vh - 76px); position: sticky; top: 76px;
                    overflow-y: auto; padding-bottom: 40px;
                }
                .db-sidebar-header {
                    font-size: 16px; font-weight: 700; color: #0f1111;
                    padding: 16px; display: flex; justify-content: space-between; align-items: center;
                }
                .db-nav-group { margin-bottom: 16px; }
                .db-nav-group-title {
                    font-size: 13px; font-weight: 700; color: #0f1111;
                    padding: 8px 16px; display: flex; align-items: center; gap: 4px; cursor: pointer;
                }
                .db-nav-group-title:hover { background: #f2f8fd; color: #0073bb; }
                .db-nav-item {
                    display: block; padding: 8px 16px 8px 32px;
                    font-size: 13px; color: #555; text-decoration: none;
                }
                .db-nav-item:hover { background: #f2f8fd; color: #0073bb; text-decoration: none; }
                .db-nav-item.active {
                    color: #0073bb; font-weight: 700; position: relative;
                }
                .db-nav-item.active::before {
                    content: ""; position: absolute; left: 0; top: 0; bottom: 0;
                    width: 3px; background: #0073bb;
                }
                .db-nav-badge {
                    background: #f2f8fd; color: #0073bb; border: 1px solid #0073bb;
                    font-size: 10px; font-weight: 700; padding: 0 4px; border-radius: 2px;
                    margin-left: 8px;
                }

                /* ── CONTENT ── */
                .db-content {
                    flex: 1; padding: 24px 32px; background: #f2f3f3; min-width: 0; padding-bottom: 60px;
                }

                /* ── FIXED FOOTER ── */
                .db-footer {
                    position: fixed; bottom: 0; left: 0; width: 100%;
                    height: 40px; background: #161e2d; color: #c8cdd5;
                    display: flex; align-items: center; padding: 0 16px;
                    font-size: 12px; gap: 0; z-index: 100;
                }
                .db-footer-left { display: flex; align-items: center; gap: 20px; }
                .db-footer-left span { display: flex; align-items: center; gap: 4px; cursor: pointer; }
                .db-footer-left span:hover { color: #fff; }
                .db-footer-center { margin-left: auto; margin-right: 24px; font-size: 11px; }
                .db-footer-right { display: flex; gap: 16px; }
                .db-footer-right span { cursor: pointer; }
                .db-footer-right span:hover { color: #fff; text-decoration: underline; }
            `}</style>

            <header className="db-nav">
                <div className="db-logo" onClick={() => router.push("/")}>
                    aws
                </div>
                <div className="db-nav-btn"><Grid3X3 size={16} /></div>
                
                <div className="db-search">
                    <Search size={14} />
                    <span>Search</span>
                    <span className="db-search-shortcut">[Alt+S]</span>
                </div>

                <div className="db-nav-right">
                    <button className="db-nav-btn"><Terminal size={16} /></button>
                    <button className="db-nav-btn"><Bell size={16} /></button>
                    <button className="db-nav-btn"><CircleHelp size={16} /></button>
                    <button className="db-nav-btn"><Settings size={16} /></button>
                    
                    <div className="db-nav-btn" style={{ fontSize: '13px', gap: '4px' }}>
                        Global <ChevronDown size={12} />
                    </div>

                    <div className="db-account-info">
                        {userName} (987119353115) <ChevronDown size={12} />
                    </div>
                    <button className="db-signout-btn" onClick={handleSignOut}>Sign out</button>
                </div>
            </header>

            <div className="db-secondary">
                <button className="db-secondary-btn"><Menu size={18} /></button>
                <div className="db-breadcrumb">
                    <span><Link href="/dashboard">Route 53</Link> <ChevronRight size={14} /></span>
                    <span className="db-breadcrumb-current">
                        {pathname === "/dashboard" ? "Dashboard" : 
                         pathname.includes("/hosted-zones") ? "Hosted zones" : 
                         pathname.includes("/health-checks") ? "Health checks" :
                         pathname.includes("/profiles") ? "Profiles" : "Dashboard"}
                    </span>
                </div>
                <div style={{ marginLeft: "auto" }}>
                    <button className="db-nav-btn" style={{ color: "#555" }}><Info size={18} /></button>
                </div>
            </div>

            <div className="db-main">
                <aside className="db-sidebar">
                    <div className="db-sidebar-header">
                        Route 53
                        <ChevronRight size={16} style={{ color: "#555", cursor: "pointer" }} />
                    </div>
                    
                    <div className="db-nav-group">
                        <Link href="/dashboard" className={`db-nav-item ${pathname === "/dashboard" ? "active" : ""}`}>
                            Dashboard
                        </Link>
                        <Link href="/hosted-zones" className={`db-nav-item ${pathname.includes("/hosted-zones") ? "active" : ""}`}>
                            Hosted zones
                        </Link>
                        <Link href="/health-checks" className={`db-nav-item ${pathname === "/health-checks" ? "active" : ""}`}>
                            Health checks
                        </Link>
                        <Link href="/profiles" className={`db-nav-item ${pathname === "/profiles" ? "active" : ""}`}>
                            Profiles
                        </Link>
                    </div>

                    <div className="db-nav-group">
                        <div className="db-nav-group-title"><ChevronDown size={14} /> Global Resolver</div>
                        <Link href="/resolver" className="db-nav-item">Global resolvers <span className="db-nav-badge">New</span></Link>
                        <Link href="/resolver" className="db-nav-item">Shared DNS views <span className="db-nav-badge">New</span></Link>
                    </div>

                    <div className="db-nav-group">
                        <div className="db-nav-group-title"><ChevronDown size={14} /> VPC Resolver</div>
                        <Link href="/resolver" className="db-nav-item">VPCs</Link>
                        <Link href="/resolver" className="db-nav-item">Inbound endpoints</Link>
                        <Link href="/resolver" className="db-nav-item">Outbound endpoints</Link>
                        <Link href="/resolver" className="db-nav-item">Rules</Link>
                        <Link href="/resolver" className="db-nav-item">Query logging</Link>
                        <Link href="/resolver" className="db-nav-item">Outposts</Link>
                    </div>

                    <div className="db-nav-group">
                        <div className="db-nav-group-title"><ChevronDown size={14} /> Domains</div>
                        <Link href="/dashboard" className="db-nav-item">Registered domains</Link>
                        <Link href="/dashboard" className="db-nav-item">Requests</Link>
                    </div>
                </aside>

                <main className="db-content">
                    {children}
                </main>
            </div>

            <footer className="db-footer">
                <div className="db-footer-left">
                    <span><Terminal size={14} /> CloudShell</span>
                    <span><Monitor size={14} /> Agent Toolkit for AWS</span>
                    <span>Feedback</span>
                    <span><MessageSquare size={14} /> Console Mobile App</span>
                </div>
                <div className="db-footer-center">
                    © 2026, Amazon Web Services, Inc. or its affiliates.
                </div>
                <div className="db-footer-right">
                    <span>Privacy</span>
                    <span>Terms</span>
                    <span>Cookie preferences</span>
                </div>
            </footer>
        </div>
    );
}
