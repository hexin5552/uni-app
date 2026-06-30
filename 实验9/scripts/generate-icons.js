// 生成tabBar图标的脚本
// 使用Node.js内置模块创建简单PNG图标

const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '..', 'static');

// 创建简单的PNG文件（使用zlib库压缩）
const zlib = require('zlib');

function createPng(size, pixels) {
	// PNG文件结构
	const width = size;
	const height = size;
	const channels = 4; // RGBA

	// 创建像素数据
	const rowSize = width * channels + 1; // +1 for filter byte
	const rawData = Buffer.alloc(rowSize * height);

	for (let y = 0; y < height; y++) {
		const rowStart = y * rowSize;
		rawData[rowStart] = 0; // filter type 0 (None)

		for (let x = 0; x < width; x++) {
			const pixelIndex = (x * channels) + rowStart + 1;

			// 简单的圆形图标 - 检查像素是否在圆内
			const centerX = width / 2;
			const centerY = height / 2;
			const radius = size * 0.4;
			const dx = x - centerX;
			const dy = y - centerY;
			const distance = Math.sqrt(dx * dx + dy * dy);

			if (distance < radius) {
				// 圆内 - 设置颜色
				rawData[pixelIndex] = pixels.r;     // R
				rawData[pixelIndex + 1] = pixels.g; // G
				rawData[pixelIndex + 2] = pixels.b; // B
				rawData[pixelIndex + 3] = pixels.a; // A
			} else {
				rawData[pixelIndex] = 0;
				rawData[pixelIndex + 1] = 0;
				rawData[pixelIndex + 2] = 0;
				rawData[pixelIndex + 3] = 0;
			}
		}
	}

	// 创建PNG
	return createPngFromData(width, height, rawData);
}

function createPngFromData(width, height, rawData) {
	const compressed = zlib.deflateSync(rawData);

	// PNG signature
	const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

	// IHDR chunk
	const ihdrData = Buffer.alloc(13);
	ihdrData.writeUInt32BE(width, 0);
	ihdrData.writeUInt32BE(height, 4);
	ihdrData[8] = 8;  // bit depth
	ihdrData[9] = 6;  // color type (RGBA)
	ihdrData[10] = 0; // compression
	ihdrData[11] = 0; // filter
	ihdrData[12] = 0; // interlace

	const ihdr = createChunk('IHDR', ihdrData);
	const idat = createChunk('IDAT', compressed);
	const iend = createChunk('IEND', Buffer.alloc(0));

	return Buffer.concat([signature, ihdr, idat, iend]);
}

function createChunk(type, data) {
	const typeBuffer = Buffer.from(type, 'ascii');
	const length = Buffer.alloc(4);
	length.writeUInt32BE(data.length, 0);

	const crcData = Buffer.concat([typeBuffer, data]);
	const crc = Buffer.alloc(4);
	crc.writeUInt32BE(crc32(crcData), 0);

	return Buffer.concat([length, typeBuffer, data, crc]);
}

function crc32(data) {
	let crc = 0xFFFFFFFF;
	for (let i = 0; i < data.length; i++) {
		crc ^= data[i];
		for (let j = 0; j < 8; j++) {
			if (crc & 1) {
				crc = (crc >>> 1) ^ 0xEDB88320;
			} else {
				crc = crc >>> 1;
			}
		}
	}
	return (crc ^ 0xFFFFFFFF) >>> 0;
}

// 创建简单图标 - 使用基础形状（圆形或方形）
// 由于tabBar图标需要是简单图形，这里用基础形状表示

// 首页 - 房子形状
function createHomeIcon(size, color) {
	const width = size;
	const height = size;
	const channels = 4;
	const rowSize = width * channels + 1;
	const rawData = Buffer.alloc(rowSize * height);

	for (let y = 0; y < height; y++) {
		const rowStart = y * rowSize;
		rawData[rowStart] = 0;

		for (let x = 0; x < width; x++) {
			const pixelIndex = (x * channels) + rowStart + 1;
			// 房子形状 - 三角屋顶 + 矩形身体
			const cx = width / 2;
			const cy = height / 2;

			// 三角形屋顶
			if (y < height * 0.5) {
				const t = y / (height * 0.5);
				const halfWidth = t * (width * 0.45);
				if (Math.abs(x - cx) < halfWidth) {
					rawData[pixelIndex] = color[0];
					rawData[pixelIndex + 1] = color[1];
					rawData[pixelIndex + 2] = color[2];
					rawData[pixelIndex + 3] = 255;
				}
			} else {
				// 矩形身体
				const halfW = width * 0.35;
				const halfH = height * 0.25;
				if (Math.abs(x - cx) < halfW && Math.abs(y - (cy + halfH * 0.5)) < halfH) {
					rawData[pixelIndex] = color[0];
					rawData[pixelIndex + 1] = color[1];
					rawData[pixelIndex + 2] = color[2];
					rawData[pixelIndex + 3] = 255;
				}
			}
		}
	}

	return createPngFromData(width, height, rawData);
}

// 订单 - 列表形状
function createOrderIcon(size, color) {
	const width = size;
	const height = size;
	const channels = 4;
	const rowSize = width * channels + 1;
	const rawData = Buffer.alloc(rowSize * height);

	const lineHeight = height / 5;
	const startX = width * 0.2;
	const endX = width * 0.8;

	for (let y = 0; y < height; y++) {
		const rowStart = y * rowSize;
		rawData[rowStart] = 0;

		for (let x = 0; x < width; x++) {
			const pixelIndex = (x * channels) + rowStart + 1;

			// 4条横线代表列表
			for (let i = 1; i <= 4; i++) {
				const lineY = i * lineHeight;
				if (Math.abs(y - lineY) < 4 && x >= startX && x <= endX) {
					rawData[pixelIndex] = color[0];
					rawData[pixelIndex + 1] = color[1];
					rawData[pixelIndex + 2] = color[2];
					rawData[pixelIndex + 3] = 255;
				}
			}
		}
	}

	return createPngFromData(width, height, rawData);
}

// 公司 - 建筑形状
function createCompanyIcon(size, color) {
	const width = size;
	const height = size;
	const channels = 4;
	const rowSize = width * channels + 1;
	const rawData = Buffer.alloc(rowSize * height);

	const startX = width * 0.2;
	const endX = width * 0.8;
	const startY = height * 0.2;
	const endY = height * 0.8;

	for (let y = 0; y < height; y++) {
		const rowStart = y * rowSize;
		rawData[rowStart] = 0;

		for (let x = 0; x < width; x++) {
			const pixelIndex = (x * channels) + rowStart + 1;

			// 建筑物外框
			if (x >= startX && x <= endX && y >= startY && y <= endY) {
				// 边框
				if (x <= startX + 6 || x >= endX - 6 || y <= startY + 6 || y >= endY - 6) {
					rawData[pixelIndex] = color[0];
					rawData[pixelIndex + 1] = color[1];
					rawData[pixelIndex + 2] = color[2];
					rawData[pixelIndex + 3] = 255;
				}
			}
		}
	}

	return createPngFromData(width, height, rawData);
}

// 我的 - 人物形状
function createMineIcon(size, color) {
	const width = size;
	const height = size;
	const channels = 4;
	const rowSize = width * channels + 1;
	const rawData = Buffer.alloc(rowSize * height);

	const cx = width / 2;
	const headY = height * 0.3;
	const headR = width * 0.15;
	const bodyTopY = height * 0.5;
	const bodyBottomY = height * 0.85;

	for (let y = 0; y < height; y++) {
		const rowStart = y * rowSize;
		rawData[rowStart] = 0;

		for (let x = 0; x < width; x++) {
			const pixelIndex = (x * channels) + rowStart + 1;

			// 头部 - 圆形
			const dx = x - cx;
			const dy = y - headY;
			if (Math.sqrt(dx * dx + dy * dy) < headR) {
				rawData[pixelIndex] = color[0];
				rawData[pixelIndex + 1] = color[1];
				rawData[pixelIndex + 2] = color[2];
				rawData[pixelIndex + 3] = 255;
			}

			// 身体 - 半圆
			if (y >= bodyTopY && y <= bodyBottomY) {
				const bodyR = (bodyBottomY - bodyTopY);
				const bodyDy = y - (bodyTopY + bodyR);
				const bodyDx = x - cx;
				if (Math.abs(bodyDy) < bodyR * 0.5 && Math.abs(bodyDx) < bodyR) {
					if ((bodyDx * bodyDx) / (bodyR * bodyR) + (bodyDy * bodyDy) / (bodyR * bodyR * 0.25) <= 1) {
						rawData[pixelIndex] = color[0];
						rawData[pixelIndex + 1] = color[1];
						rawData[pixelIndex + 2] = color[2];
						rawData[pixelIndex + 3] = 255;
					}
				}
			}
		}
	}

	return createPngFromData(width, height, rawData);
}

// 颜色定义
const colorGray = [153, 153, 153, 255];      // 灰色 - 未选中
const colorGreen = [76, 175, 80, 255];      // 绿色 - 选中

// 生成所有图标 (96x96 像素)
const size = 96;

const icons = [
	{ name: 'home.png', data: createHomeIcon(size, colorGray) },
	{ name: 'home-active.png', data: createHomeIcon(size, colorGreen) },
	{ name: 'order.png', data: createOrderIcon(size, colorGray) },
	{ name: 'order-active.png', data: createOrderIcon(size, colorGreen) },
	{ name: 'company.png', data: createCompanyIcon(size, colorGray) },
	{ name: 'company-active.png', data: createCompanyIcon(size, colorGreen) },
	{ name: 'mine.png', data: createMineIcon(size, colorGray) },
	{ name: 'mine-active.png', data: createMineIcon(size, colorGreen) }
];

// 保存文件
icons.forEach(icon => {
	const filePath = path.join(outputDir, icon.name);
	fs.writeFileSync(filePath, icon.data);
	console.log(`已创建: ${icon.name} (${icon.data.length} bytes)`);
});

console.log('所有tabBar图标生成完成！');
