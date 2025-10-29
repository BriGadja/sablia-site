import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Router } from "wouter";
import Footer from "./Footer";

describe("Footer", () => {
  it("renders the footer with company name", () => {
    render(
      <Router>
        <Footer />
      </Router>,
    );

    const sabliaElements = screen.getAllByText(/Sablia/i);
    expect(sabliaElements.length).toBeGreaterThan(0);
  });

  it("displays copyright with current year", () => {
    render(
      <Router>
        <Footer />
      </Router>,
    );

    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(new RegExp(`${currentYear}.*Sablia`, "i")),
    ).toBeInTheDocument();
  });

  it("has email contact link", () => {
    render(
      <Router>
        <Footer />
      </Router>,
    );

    const emailLink = screen.getByText(/brice@sablia.io/i);
    expect(emailLink).toBeInTheDocument();
    expect(emailLink.closest("a")).toHaveAttribute(
      "href",
      "mailto:brice@sablia.io",
    );
  });

  it("has legal links", () => {
    render(
      <Router>
        <Footer />
      </Router>,
    );

    expect(screen.getByText(/Mentions légales/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Politique de confidentialité/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/CGV/i)).toBeInTheDocument();
  });

  it("has AI documentation link", () => {
    render(
      <Router>
        <Footer />
      </Router>,
    );

    const docLink = screen.getByText(/Documentation pour IA/i);
    expect(docLink).toBeInTheDocument();
    expect(docLink.closest("a")).toHaveAttribute(
      "href",
      "https://github.com/BriGadja/sablia-site/blob/main/docs/README.md",
    );
  });
});
