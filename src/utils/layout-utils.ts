import { backgroundWallpaper } from "../config";

// 将单个值或数组统一为数组
const toArray = (src: string | string[] | undefined): string[] => {
	if (!src) return [];
	if (Array.isArray(src)) return src;
	return [src];
};

type ResponsiveBackgroundSource = {
	desktop?: string | string[];
	mobile?: string | string[];
};

type BackgroundImages = {
	desktop: string[];
	mobile: string[];
	lightDesktop: string[];
	lightMobile: string[];
	isThemeSpecific: boolean;
	isMultiple: boolean;
};

const resolveResponsiveSource = (
	src: ResponsiveBackgroundSource,
): { desktop: string[]; mobile: string[] } => {
	const desktop = toArray(src.desktop);
	const mobile = toArray(src.mobile);
	return {
		desktop: desktop.length > 0 ? desktop : mobile,
		mobile: mobile.length > 0 ? mobile : desktop,
	};
};

// 背景图片处理工具函数
// 返回所有配置的图片（用于构建时渲染所有图片）
export const getBackgroundImages = (): BackgroundImages => {
	const bgSrc = backgroundWallpaper.src;

	if (
		typeof bgSrc === "object" &&
		bgSrc !== null &&
		!Array.isArray(bgSrc) &&
		("desktop" in bgSrc || "mobile" in bgSrc || "light" in bgSrc)
	) {
		const srcObj = bgSrc as ResponsiveBackgroundSource & {
			light?: ResponsiveBackgroundSource;
		};
		const baseImages = resolveResponsiveSource(srcObj);
		const configuredLightImages = resolveResponsiveSource(srcObj.light ?? {});
		const hasLightImages =
			configuredLightImages.desktop.length > 0 ||
			configuredLightImages.mobile.length > 0;
		const lightImages = hasLightImages ? configuredLightImages : baseImages;
		const darkImages =
			baseImages.desktop.length > 0 || baseImages.mobile.length > 0
				? baseImages
				: lightImages;
		return {
			desktop: darkImages.desktop,
			mobile: darkImages.mobile,
			lightDesktop: lightImages.desktop,
			lightMobile: lightImages.mobile,
			isThemeSpecific: hasLightImages,
			isMultiple:
				darkImages.desktop.length > 1 ||
				darkImages.mobile.length > 1 ||
				lightImages.desktop.length > 1 ||
				lightImages.mobile.length > 1,
		};
	}
	// 如果是字符串或数组，同时用于桌面端和移动端
	const images = toArray(bgSrc as string | string[]);
	return {
		desktop: images,
		mobile: images,
		lightDesktop: images,
		lightMobile: images,
		isThemeSpecific: false,
		isMultiple: images.length > 1,
	};
};

// 类型守卫函数
export const isBannerSrcObject = (
	src:
		| string
		| string[]
		| {
				desktop?: string | string[];
				mobile?: string | string[];
				light?: ResponsiveBackgroundSource;
		  },
): src is ResponsiveBackgroundSource & {
	light?: ResponsiveBackgroundSource;
} => {
	return (
		typeof src === "object" &&
		src !== null &&
		!Array.isArray(src) &&
		("desktop" in src || "mobile" in src || "light" in src)
	);
};

// 获取默认背景图片（返回第一张，用于 SEO 等场景）
export const getDefaultBackground = (): string => {
	const images = getBackgroundImages();
	return images.desktop[0] || images.mobile[0] || "";
};

// 检查是否为首页
export const isHomePage = (pathname: string): boolean => {
	// 获取 base URL
	const baseUrl = import.meta.env.BASE_URL || "/";
	const baseUrlNoSlash = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

	if (pathname === baseUrl) return true;
	if (pathname === baseUrlNoSlash) return true;
	if (pathname === "/") return true;

	return false;
};

// 获取横幅偏移量
export const getBannerOffset = (position = "center") => {
	const bannerOffsetByPosition = {
		top: "100vh",
		center: "50vh",
		bottom: "0",
	};
	return (
		bannerOffsetByPosition[position as keyof typeof bannerOffsetByPosition] ||
		"50vh"
	);
};
