export default {
	testEnvironment: "node",
	roots: ["<rootDir>/backend/tests"],
	collectCoverageFrom: ["backend/**/*.js", "!backend/tests/**"],
};
