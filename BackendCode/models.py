from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    """User account table"""
    __tablename__ = 'users'
    
    username = db.Column(db.String(50), primary_key=True)  # Changed to username as primary key
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)  # NEW: Store hashed password
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship to favorite routes
    favorite_routes = db.relationship('FavoriteRoute', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def set_password(self, password):
        """Hash and store the password securely"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Check if the provided password matches the stored hash"""
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        """Convert user to dictionary for API responses"""
        return {
            'username': self.username,
            'email': self.email,
            'name': self.name,
            'created_at': self.created_at.isoformat()
        }


class FavoriteRoute(db.Model):
    """Saved favorite routes for users"""
    __tablename__ = 'favorite_routes'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), db.ForeignKey('users.username'), nullable=False)  # Changed to username
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
            'username': self.username,
            'nickname': self.nickname,
            'start_location': self.start_location,
            'end_location': self.end_location,
            'path_coordinates': json.loads(self.path_coordinates) if self.path_coordinates else [],
            'created_at': self.created_at.isoformat()
        }