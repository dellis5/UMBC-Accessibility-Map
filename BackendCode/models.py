from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    """User account table"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship to favorite routes
    favorite_routes = db.relationship('FavoriteRoute', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        """Convert user to dictionary for API responses"""
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'created_at': self.created_at.isoformat()
        }


class FavoriteRoute(db.Model):
    """Saved favorite routes for users"""
    __tablename__ = 'favorite_routes'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    nickname = db.Column(db.String(100))  # e.g., "Morning route to class"
    start_location = db.Column(db.String(100), nullable=False)
    end_location = db.Column(db.String(100), nullable=False)
    path_coordinates = db.Column(db.Text)  # JSON string of coordinates
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        """Convert favorite route to dictionary for API responses"""
        import json
        return {
            'id': self.id,
            'user_id': self.user_id,
            'nickname': self.nickname,
            'start_location': self.start_location,
            'end_location': self.end_location,
            'path_coordinates': json.loads(self.path_coordinates) if self.path_coordinates else [],
            'created_at': self.created_at.isoformat()
        }