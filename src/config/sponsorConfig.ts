import type { SponsorConfig } from "../types/sponsorConfig";

export const sponsorConfig: SponsorConfig = {
	// 页面标题
	title: "支持本站",

	// 页面描述文本
	description: "如果博客内容对你有帮助，欢迎在收款方式开放后支持本站。",

	// 打赏用途说明
	usage: "收款方式尚未配置，后续开放后会在此页面显示。",

	// 是否显示打赏者列表
	showSponsorsList: false,

	// 是否显示评论区，需要先在commentConfig.ts启用评论系统
	showComment: true,

	// 是否在文章详情页底部显示打赏按钮
	showButtonInPost: false,

	// 打赏方式列表
	methods: [],

	// 打赏者列表（可选）
	sponsors: [],
};
