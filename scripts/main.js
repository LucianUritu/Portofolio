import { PortfolioApp } from "./core/PortfolioApp.js";
import { portfolioProfile } from "./data/portfolioProfile.js";

const app = new PortfolioApp(portfolioProfile);
app.mount();
