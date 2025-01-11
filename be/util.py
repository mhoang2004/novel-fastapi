import re


def generate_slug(text):
    """
    Converts a given text into a URL-friendly slug.
    """
    # Convert to lowercase
    slug = text.lower()
    # Remove special characters and punctuation
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    # Replace spaces (and similar) with hyphens
    slug = re.sub(r'\s+', '-', slug)
    # Remove consecutive hyphens
    slug = re.sub(r'-+', '-', slug)
    # Trim hyphens from start and end
    slug = slug.strip('-')
    return slug
