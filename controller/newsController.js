const { News } = require('../model/tableRelations');
const { Op } = require('sequelize');

exports.createNews = async (req, res) => {
    try {
        const {
            from_role,
            to_role,
            title,
            message,
            image_url,
            priority = 'medium',
            is_active = true,
            expires_at,
            published_at
        } = req.body;

        if (!from_role || !to_role || !title) {
            return res.status(400).json({
                success: false,
                message: 'Los campos from_role, to_role y title son obligatorios'
            });
        }

        if (!message && !image_url) {
            return res.status(400).json({
                success: false,
                message: 'Debe incluir al menos un mensaje o una imagen'
            });
        }

        const newsData = {
            from_role,
            to_role,
            title,
            message,
            image_url,
            priority,
            is_active,
            expires_at,
            published_at: published_at || new Date()
        };

        const newNews = await News.create(newsData);

        res.status(201).json({
            success: true,
            message: 'Notificación creada exitosamente',
            data: newNews
        });

    } catch (error) {
        console.error('Error al crear notificación:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

exports.getAllNews = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            from_role,
            to_role,
            priority,
            is_active,
            sort_by = 'published_at',
            sort_order = 'DESC'
        } = req.query;

        const offset = (page - 1) * limit;
        const whereClause = {};

        if (from_role) whereClause.from_role = from_role;
        if (to_role) whereClause.to_role = to_role;
        if (priority) whereClause.priority = priority;
        if (is_active !== undefined) whereClause.is_active = is_active === 'true';

        const { count, rows } = await News.findAndCountAll({
            where: whereClause,
            order: [[sort_by, sort_order]],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.status(200).json({
            success: true,
            data: rows,
            pagination: {
                total: count,
                current_page: parseInt(page),
                total_pages: Math.ceil(count / limit),
                per_page: parseInt(limit)
            }
        });

    } catch (error) {
        console.error('Error al obtener notificaciones:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

exports.getActiveNewsByRole = async (req, res) => {
    try {
        const { role } = req.params;
        const { limit = 10 } = req.query;

        const activeNews = await News.findAll({
            where: {
                to_role: role,
                is_active: true,
                published_at: {
                    [Op.lte]: new Date()
                },
                [Op.or]: [
                    { expires_at: null },
                    { expires_at: { [Op.gt]: new Date() } }
                ]
            },
            order: [
                ['priority', 'DESC'],
                ['published_at', 'DESC']
            ],
            limit: parseInt(limit)
        });

        res.status(200).json({
            success: true,
            data: activeNews,
            count: activeNews.length
        });

    } catch (error) {
        console.error('Error al obtener notificaciones activas:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

exports.getNewsById = async (req, res) => {
    try {
        const { id } = req.params;

        const news = await News.findByPk(id);

        if (!news) {
            return res.status(404).json({
                success: false,
                message: 'Notificación no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            data: news
        });

    } catch (error) {
        console.error('Error al obtener notificación:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

exports.updateNews = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const news = await News.findByPk(id);
        if (!news) {
            return res.status(404).json({
                success: false,
                message: 'Notificación no encontrada'
            });
        }

        if (updateData.message !== undefined || updateData.image_url !== undefined) {
            const finalMessage = updateData.message !== undefined ? updateData.message : news.message;
            const finalImageUrl = updateData.image_url !== undefined ? updateData.image_url : news.image_url;

            if (!finalMessage && !finalImageUrl) {
                return res.status(400).json({
                    success: false,
                    message: 'Debe incluir al menos un mensaje o una imagen'
                });
            }
        }

        await news.update(updateData);

        res.status(200).json({
            success: true,
            message: 'Notificación actualizada exitosamente',
            data: news
        });

    } catch (error) {
        console.error('Error al actualizar notificación:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

exports.DeleteNews = async (req, res) => {
    try {
        const { id } = req.params;

        const news = await News.findByPk(id);
        if (!news) {
            return res.status(404).json({
                success: false,
                message: 'Notificación no encontrada'
            });
        }

        await news.update({ is_active: false });

        res.status(200).json({
            success: true,
            message: 'Notificación desactivada exitosamente'
        });

    } catch (error) {
        console.error('Error al desactivar notificación:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};
